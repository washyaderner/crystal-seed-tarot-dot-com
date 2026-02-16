"""Gmail API integration — fetch and search emails for business contacts."""

import base64
import json
import re
from datetime import datetime, timezone
from email.utils import parseaddr

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from config import DATA_DIR, GMAIL_EXCLUDE_QUERY_PARTS, LAST_SCAN_FILE


def _get_service(creds: Credentials):
    """Build the Gmail API service."""
    return build("gmail", "v1", credentials=creds)


def _load_scan_state() -> dict:
    """Load last scan state (timestamp + processed IDs)."""
    if LAST_SCAN_FILE.exists():
        with open(LAST_SCAN_FILE) as f:
            return json.load(f)
    return {"last_scan": None, "processed_ids": []}


def _save_scan_state(state: dict):
    """Save scan state to disk."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(LAST_SCAN_FILE, "w") as f:
        json.dump(state, f, indent=2)


def _build_query(after_date: str | None = None) -> str:
    """Build a Gmail search query that excludes noise."""
    parts = ["in:inbox"]

    # Exclude noise categories and senders
    for exclude in GMAIL_EXCLUDE_QUERY_PARTS:
        parts.append(f"-{exclude}")

    # Only get emails after the last scan
    if after_date:
        parts.append(f"after:{after_date}")

    return " ".join(parts)


def _extract_sender(headers: list[dict]) -> tuple[str, str]:
    """Extract sender name and email from message headers."""
    for header in headers:
        if header["name"].lower() == "from":
            name, email = parseaddr(header["value"])
            return name, email.lower()
    return "", ""


def _extract_subject(headers: list[dict]) -> str:
    """Extract subject from message headers."""
    for header in headers:
        if header["name"].lower() == "subject":
            return header["value"]
    return ""


def _extract_body_snippet(payload: dict, max_chars: int = 500) -> str:
    """Extract a text snippet from the email body."""
    # Try to get plain text body
    if payload.get("mimeType") == "text/plain" and payload.get("body", {}).get("data"):
        text = base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="replace")
        return text[:max_chars]

    # Check parts for text/plain
    for part in payload.get("parts", []):
        if part.get("mimeType") == "text/plain" and part.get("body", {}).get("data"):
            text = base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="replace")
            return text[:max_chars]

        # Nested multipart
        for subpart in part.get("parts", []):
            if subpart.get("mimeType") == "text/plain" and subpart.get("body", {}).get("data"):
                text = base64.urlsafe_b64decode(subpart["body"]["data"]).decode("utf-8", errors="replace")
                return text[:max_chars]

    return ""


def scan_emails(creds: Credentials, max_results: int = 100) -> list[dict]:
    """Scan Gmail for new emails since last scan.

    Returns a list of dicts with:
        - id: message ID
        - sender_email: sender's email address
        - sender_name: sender's display name
        - subject: email subject
        - snippet: body text snippet (first 500 chars)
        - date: email date
    """
    service = _get_service(creds)
    state = _load_scan_state()

    processed_ids = set(state.get("processed_ids", []))
    after_date = state.get("last_scan")

    query = _build_query(after_date)
    print(f"Gmail query: {query}")

    # Fetch message IDs
    results = (
        service.users()
        .messages()
        .list(userId="me", q=query, maxResults=max_results)
        .execute()
    )

    messages = results.get("messages", [])
    if not messages:
        print("No new emails found.")
        return []

    print(f"Found {len(messages)} emails to process.")

    new_emails = []
    for msg_ref in messages:
        msg_id = msg_ref["id"]
        if msg_id in processed_ids:
            continue

        # Fetch full message
        msg = (
            service.users()
            .messages()
            .get(userId="me", id=msg_id, format="full")
            .execute()
        )

        headers = msg.get("payload", {}).get("headers", [])
        sender_name, sender_email = _extract_sender(headers)
        subject = _extract_subject(headers)
        snippet = _extract_body_snippet(msg.get("payload", {}))

        # Use Gmail's snippet as fallback
        if not snippet:
            snippet = msg.get("snippet", "")

        new_emails.append(
            {
                "id": msg_id,
                "sender_email": sender_email,
                "sender_name": sender_name,
                "subject": subject,
                "snippet": snippet,
                "date": msg.get("internalDate", ""),
            }
        )

        processed_ids.add(msg_id)

    # Update scan state
    state["last_scan"] = datetime.now(timezone.utc).strftime("%Y/%m/%d")
    state["processed_ids"] = list(processed_ids)
    _save_scan_state(state)

    print(f"Processed {len(new_emails)} new emails.")
    return new_emails


UNSUBSCRIBE_PATTERNS = re.compile(
    r"\b(unsubscribe|remove me|stop emailing|opt out|take me off|"
    r"don'?t (want|need) (any ?more|these) emails?|"
    r"please remove|no longer wish|stop sending)\b",
    re.IGNORECASE,
)


def scan_for_unsubscribes(creds: Credentials, max_results: int = 50) -> list[dict]:
    """Scan Gmail for incoming emails that look like unsubscribe requests.

    Returns a list of dicts with sender_email, sender_name, subject, snippet.
    """
    service = _get_service(creds)
    state = _load_scan_state()
    after_date = state.get("last_scan")

    # Search for emails containing unsubscribe-like language
    query = "in:inbox {unsubscribe remove opt-out}"
    if after_date:
        query += f" after:{after_date}"

    results = (
        service.users()
        .messages()
        .list(userId="me", q=query, maxResults=max_results)
        .execute()
    )

    messages = results.get("messages", [])
    if not messages:
        return []

    unsubscribes = []
    for msg_ref in messages:
        msg = (
            service.users()
            .messages()
            .get(userId="me", id=msg_ref["id"], format="full")
            .execute()
        )

        headers = msg.get("payload", {}).get("headers", [])
        sender_name, sender_email = _extract_sender(headers)
        subject = _extract_subject(headers)
        snippet = _extract_body_snippet(msg.get("payload", {}))
        if not snippet:
            snippet = msg.get("snippet", "")

        # Skip emails FROM Holly (outgoing)
        if "crystalseedtarot" in sender_email or "hollymcole" in sender_email:
            continue

        # Check if the subject or body actually matches unsubscribe intent
        text = f"{subject} {snippet}"
        if UNSUBSCRIBE_PATTERNS.search(text):
            unsubscribes.append(
                {
                    "sender_email": sender_email,
                    "sender_name": sender_name,
                    "subject": subject,
                    "snippet": snippet[:200],
                }
            )

    return unsubscribes
