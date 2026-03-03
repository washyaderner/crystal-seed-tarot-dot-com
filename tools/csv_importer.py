#!/usr/bin/env python3
"""Import existing contacts from a CSV file into the Google Sheet.

Usage:
    python tools/csv_importer.py path/to/contacts.csv
"""

import csv
import re
import sys

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

from config import OAUTH_TOKEN_FILE, SCOPES
from sheets_manager import add_contact, get_all_emails

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$")

# Common column name variations
EMAIL_COLUMNS = {"email", "e-mail", "email_address", "emailaddress", "mail"}
NAME_COLUMNS = {"name", "full_name", "fullname", "contact_name", "contactname", "first_name"}


def _find_column(headers: list[str], candidates: set[str]) -> int | None:
    """Find the index of a column by checking against candidate names."""
    for i, h in enumerate(headers):
        if h.strip().lower().replace(" ", "_") in candidates:
            return i
    return None


def load_credentials() -> Credentials:
    """Load saved OAuth credentials."""
    if not OAUTH_TOKEN_FILE.exists():
        print("Error: Not authenticated. Run setup.py first.")
        sys.exit(1)

    creds = Credentials.from_authorized_user_file(str(OAUTH_TOKEN_FILE), SCOPES)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
    return creds


def import_csv(csv_path: str):
    """Import contacts from a CSV file."""
    print(f"Reading {csv_path}...")

    with open(csv_path, newline="", encoding="utf-8-sig") as f:
        reader = csv.reader(f)
        headers = next(reader)

        email_col = _find_column(headers, EMAIL_COLUMNS)
        name_col = _find_column(headers, NAME_COLUMNS)

        if email_col is None:
            print(f"Error: Could not find email column in headers: {headers}")
            print(f"Expected one of: {EMAIL_COLUMNS}")
            sys.exit(1)

        print(f"Email column: '{headers[email_col]}' (index {email_col})")
        if name_col is not None:
            print(f"Name column: '{headers[name_col]}' (index {name_col})")
        else:
            print("No name column found — names will be blank.")

        rows = list(reader)

    print(f"Found {len(rows)} rows in CSV.")

    # Authenticate and get existing contacts
    creds = load_credentials()
    existing = get_all_emails(creds)
    print(f"Found {len(existing)} existing contacts in sheet.")

    added = 0
    skipped = 0
    invalid = 0

    for row in rows:
        if len(row) <= email_col:
            invalid += 1
            continue

        email = row[email_col].strip()
        name = row[name_col].strip() if name_col is not None and len(row) > name_col else ""

        if not email or not EMAIL_REGEX.match(email):
            invalid += 1
            continue

        if email.lower() in existing:
            skipped += 1
            continue

        success = add_contact(
            creds,
            email=email,
            name=name,
            source="csv_import",
            classification="",
            notes="Imported from CSV",
        )

        if success:
            added += 1
            existing.add(email.lower())  # Track locally to avoid re-querying
            print(f"  + {email} ({name})" if name else f"  + {email}")
        else:
            skipped += 1

    print(f"\nImport complete:")
    print(f"  Added:   {added}")
    print(f"  Skipped: {skipped} (already in sheet)")
    print(f"  Invalid: {invalid} (bad/missing email)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python tools/csv_importer.py <path/to/contacts.csv>")
        sys.exit(1)

    import_csv(sys.argv[1])
