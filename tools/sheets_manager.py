"""Google Sheets CRUD operations for the email contact list."""

import hashlib
import hmac
from datetime import datetime, timezone

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from config import get_sheets_id, get_unsubscribe_secret, SHEET_RANGE


def _get_service(creds: Credentials):
    """Build the Sheets API service."""
    return build("sheets", "v4", credentials=creds)


def _generate_unsubscribe_token(email: str) -> str:
    """Generate an HMAC-SHA256 token for secure unsubscribe links."""
    secret = get_unsubscribe_secret()
    return hmac.new(
        secret.encode(), email.lower().encode(), hashlib.sha256
    ).hexdigest()


def get_all_contacts(creds: Credentials) -> list[dict]:
    """Return all contacts from the sheet as a list of dicts."""
    service = _get_service(creds)
    sheet_id = get_sheets_id()

    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=sheet_id, range=f"{SHEET_RANGE}!A:H")
        .execute()
    )
    rows = result.get("values", [])

    if not rows:
        return []

    # First row is headers
    headers = rows[0]
    contacts = []
    for row in rows[1:]:
        # Pad row to match headers length
        padded = row + [""] * (len(headers) - len(row))
        contacts.append(dict(zip(headers, padded)))

    return contacts


def get_all_emails(creds: Credentials) -> set[str]:
    """Return a set of all email addresses currently in the sheet (lowercase)."""
    contacts = get_all_contacts(creds)
    return {c.get("Email", "").lower() for c in contacts if c.get("Email")}


def is_subscribed(creds: Credentials, email: str) -> bool:
    """Check if an email is in the sheet with active status."""
    contacts = get_all_contacts(creds)
    for c in contacts:
        if c.get("Email", "").lower() == email.lower():
            return c.get("Status", "active") == "active"
    return False


def add_contact(
    creds: Credentials,
    email: str,
    name: str = "",
    source: str = "manual",
    classification: str = "",
    notes: str = "",
) -> bool:
    """Add a contact to the sheet. Returns False if email already exists."""
    existing = get_all_emails(creds)
    if email.lower() in existing:
        return False

    service = _get_service(creds)
    sheet_id = get_sheets_id()

    token = _generate_unsubscribe_token(email)
    now = datetime.now(timezone.utc).isoformat()

    row = [email, name, source, now, classification, "active", token, notes]

    service.spreadsheets().values().append(
        spreadsheetId=sheet_id,
        range=f"{SHEET_RANGE}!A:H",
        valueInputOption="RAW",
        insertDataOption="INSERT_ROWS",
        body={"values": [row]},
    ).execute()

    return True


def remove_contact(creds: Credentials, email: str) -> bool:
    """Set a contact's status to 'unsubscribed'. Returns False if not found."""
    service = _get_service(creds)
    sheet_id = get_sheets_id()

    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=sheet_id, range=f"{SHEET_RANGE}!A:H")
        .execute()
    )
    rows = result.get("values", [])

    for i, row in enumerate(rows):
        if i == 0:
            continue  # skip header
        if row and row[0].lower() == email.lower():
            # Column F (index 5) is Status
            cell = f"{SHEET_RANGE}!F{i + 1}"
            service.spreadsheets().values().update(
                spreadsheetId=sheet_id,
                range=cell,
                valueInputOption="RAW",
                body={"values": [["unsubscribed"]]},
            ).execute()
            return True

    return False


def get_contact_by_token(creds: Credentials, token: str) -> dict | None:
    """Look up a contact by their unsubscribe token."""
    contacts = get_all_contacts(creds)
    for c in contacts:
        if c.get("Unsubscribe Token") == token:
            return c
    return None


def unsubscribe_by_token(creds: Credentials, token: str) -> bool:
    """Unsubscribe a contact using their token. Returns False if token not found."""
    contact = get_contact_by_token(creds, token)
    if not contact:
        return False
    return remove_contact(creds, contact["Email"])


def create_sheet_with_headers(creds: Credentials) -> str:
    """Create a new Google Sheet with proper headers. Returns the sheet ID."""
    service = _get_service(creds)

    spreadsheet = (
        service.spreadsheets()
        .create(
            body={
                "properties": {"title": "Crystal Seed Tarot — Email List"},
                "sheets": [
                    {
                        "properties": {"title": "Sheet1"},
                    }
                ],
            }
        )
        .execute()
    )

    sheet_id = spreadsheet["spreadsheetId"]

    # Add headers
    headers = [
        "Email",
        "Name",
        "Source",
        "Date Added",
        "Classification",
        "Status",
        "Unsubscribe Token",
        "Notes",
    ]

    service.spreadsheets().values().update(
        spreadsheetId=sheet_id,
        range="Sheet1!A1:H1",
        valueInputOption="RAW",
        body={"values": [headers]},
    ).execute()

    # Bold the header row and freeze it
    service.spreadsheets().batchUpdate(
        spreadsheetId=sheet_id,
        body={
            "requests": [
                {
                    "repeatCell": {
                        "range": {
                            "sheetId": 0,
                            "startRowIndex": 0,
                            "endRowIndex": 1,
                        },
                        "cell": {
                            "userEnteredFormat": {
                                "textFormat": {"bold": True},
                                "backgroundColor": {
                                    "red": 0.9,
                                    "green": 0.9,
                                    "blue": 0.95,
                                },
                            }
                        },
                        "fields": "userEnteredFormat(textFormat,backgroundColor)",
                    }
                },
                {
                    "updateSheetProperties": {
                        "properties": {
                            "sheetId": 0,
                            "gridProperties": {"frozenRowCount": 1},
                        },
                        "fields": "gridProperties.frozenRowCount",
                    }
                },
            ]
        },
    ).execute()

    return sheet_id
