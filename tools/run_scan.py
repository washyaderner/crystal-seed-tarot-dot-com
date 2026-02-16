#!/usr/bin/env python3
"""Main orchestrator — scan Gmail, classify emails, add contacts to sheet.

Usage:
    python tools/run_scan.py           # Full scan
    python tools/run_scan.py --dry-run # Preview without adding
"""

import json
import sys

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

from config import MANUAL_REVIEW_FILE, OAUTH_TOKEN_FILE, SCOPES, DATA_DIR
from email_classifier import classify_email
from gmail_scanner import scan_emails, scan_for_unsubscribes
from sheets_manager import add_contact, get_all_emails, remove_contact, is_subscribed


def load_credentials() -> Credentials:
    """Load saved OAuth credentials."""
    if not OAUTH_TOKEN_FILE.exists():
        print("Error: Not authenticated. Run setup.py first.")
        sys.exit(1)

    creds = Credentials.from_authorized_user_file(str(OAUTH_TOKEN_FILE), SCOPES)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
    return creds


def save_for_review(emails: list[dict]):
    """Save low-confidence emails for Holly's manual review."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    existing = []
    if MANUAL_REVIEW_FILE.exists():
        with open(MANUAL_REVIEW_FILE) as f:
            existing = json.load(f)

    existing.extend(emails)

    with open(MANUAL_REVIEW_FILE, "w") as f:
        json.dump(existing, f, indent=2)


def main():
    dry_run = "--dry-run" in sys.argv

    if dry_run:
        print("DRY RUN — no contacts will be added\n")

    # Step 1: Authenticate
    print("Authenticating...")
    creds = load_credentials()

    # Step 2: Get existing contacts to avoid duplication
    print("Loading existing contacts...")
    existing_emails = get_all_emails(creds)
    print(f"  {len(existing_emails)} contacts already in sheet\n")

    # Step 3: Scan Gmail
    print("Scanning Gmail...")
    emails = scan_emails(creds)

    if not emails:
        print("\nNo new emails to process.")
        return

    # Step 4: Process each email
    added = 0
    skipped_existing = 0
    skipped_irrelevant = 0
    flagged_review = 0

    for email in emails:
        sender = email["sender_email"]
        name = email["sender_name"]

        # Skip if already in sheet
        if sender.lower() in existing_emails:
            skipped_existing += 1
            continue

        # Classify with AI
        print(f"\nClassifying: {name} <{sender}>")
        print(f"  Subject: {email['subject']}")

        try:
            result = classify_email(
                sender_name=name,
                sender_email=sender,
                subject=email["subject"],
                snippet=email["snippet"],
            )
        except Exception as e:
            print(f"  Error classifying: {e}")
            continue

        print(f"  → {result['classification']} (confidence: {result['confidence']})")
        print(f"  → Should add: {result['should_add']}")
        print(f"  → Reason: {result['reason']}")

        if not result["should_add"]:
            skipped_irrelevant += 1
            continue

        if result["confidence"] == "low":
            flagged_review += 1
            save_for_review(
                [
                    {
                        "sender_email": sender,
                        "sender_name": name,
                        "subject": email["subject"],
                        "classification": result["classification"],
                        "reason": result["reason"],
                    }
                ]
            )
            print("  → Flagged for manual review (low confidence)")
            continue

        # Add to sheet
        if dry_run:
            print(f"  → Would add: {sender}")
            added += 1
        else:
            success = add_contact(
                creds,
                email=sender,
                name=name,
                source="gmail_scan",
                classification=result["classification"],
                notes=result["reason"],
            )
            if success:
                added += 1
                existing_emails.add(sender.lower())
                print(f"  → Added to sheet!")
            else:
                skipped_existing += 1

    # Summary
    action = "Would add" if dry_run else "Added"
    print(f"\n{'=' * 40}")
    print(f"Scan Complete!")
    print(f"{'=' * 40}")
    print(f"  {action}:              {added}")
    print(f"  Skipped (existing):    {skipped_existing}")
    print(f"  Skipped (irrelevant):  {skipped_irrelevant}")
    print(f"  Flagged for review:    {flagged_review}")

    if flagged_review > 0:
        print(f"\n  Review flagged emails: {MANUAL_REVIEW_FILE}")

    # Step 5: Check for unsubscribe requests
    print("\nChecking for unsubscribe requests...")
    unsub_emails = scan_for_unsubscribes(creds)
    unsubscribed = 0

    for unsub in unsub_emails:
        email_addr = unsub["sender_email"]
        if is_subscribed(creds, email_addr):
            if dry_run:
                print(f"  Would unsubscribe: {email_addr} ('{unsub['subject']}')")
                unsubscribed += 1
            else:
                remove_contact(creds, email_addr)
                print(f"  Unsubscribed: {email_addr} ('{unsub['subject']}')")
                unsubscribed += 1

    if unsubscribed:
        action = "Would unsubscribe" if dry_run else "Unsubscribed"
        print(f"  {action}: {unsubscribed}")
    else:
        print("  No unsubscribe requests found.")


if __name__ == "__main__":
    main()
