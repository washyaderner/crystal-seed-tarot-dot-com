#!/usr/bin/env python3
"""First-time setup wizard for the email list management tool.

Run this once to:
1. Authenticate with Google (Gmail + Sheets)
2. Create the Google Sheet
3. Generate necessary secrets
4. Write config to .env.local
"""

import os
import secrets
import sys
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

from config import (
    CREDENTIALS_DIR,
    OAUTH_CREDENTIALS_FILE,
    OAUTH_TOKEN_FILE,
    PROJECT_ROOT,
    SCOPES,
)
from sheets_manager import create_sheet_with_headers


def print_step(step: int, total: int, message: str):
    print(f"\n{'=' * 60}")
    print(f"  Step {step}/{total}: {message}")
    print(f"{'=' * 60}\n")


def check_credentials_file() -> bool:
    """Check if the OAuth credentials.json file exists."""
    if OAUTH_CREDENTIALS_FILE.exists():
        return True

    print("Google Cloud credentials.json not found!")
    print(f"\nExpected location: {OAUTH_CREDENTIALS_FILE}")
    print("\nTo get this file:")
    print("  1. Go to https://console.cloud.google.com/")
    print("  2. Create a new project (or select existing)")
    print("  3. Enable the Gmail API and Google Sheets API:")
    print("     - APIs & Services → Library → search 'Gmail API' → Enable")
    print("     - APIs & Services → Library → search 'Google Sheets API' → Enable")
    print("  4. Create OAuth credentials:")
    print("     - APIs & Services → Credentials → Create Credentials → OAuth client ID")
    print("     - Application type: Desktop app")
    print("     - Download the JSON file")
    print(f"  5. Save it as: {OAUTH_CREDENTIALS_FILE}")
    print("\nAfter placing the file, run this setup again.")
    return False


def authenticate() -> Credentials:
    """Run the OAuth flow and return credentials."""
    creds = None

    if OAUTH_TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(OAUTH_TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing expired token...")
            creds.refresh(Request())
        else:
            print("Opening browser for Google authentication...")
            print("(Sign in with the crystalseedtarot@gmail.com account)\n")
            flow = InstalledAppFlow.from_client_secrets_file(
                str(OAUTH_CREDENTIALS_FILE), SCOPES
            )
            creds = flow.run_local_server(port=0)

        # Save the token for future use
        CREDENTIALS_DIR.mkdir(parents=True, exist_ok=True)
        with open(OAUTH_TOKEN_FILE, "w") as token_file:
            token_file.write(creds.to_json())
        print(f"Token saved to {OAUTH_TOKEN_FILE}")

    return creds


def update_env_file(key: str, value: str):
    """Add or update a key in .env.local."""
    env_file = PROJECT_ROOT / ".env.local"

    lines = []
    found = False

    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                if line.strip().startswith(f"{key}="):
                    lines.append(f"{key}={value}\n")
                    found = True
                else:
                    lines.append(line)

    if not found:
        lines.append(f"{key}={value}\n")

    with open(env_file, "w") as f:
        f.writelines(lines)


def main():
    print("\n" + "=" * 60)
    print("  Crystal Seed Tarot — Email List Setup Wizard")
    print("=" * 60)
    print("\nThis will set up everything you need for automated email list management.")

    total_steps = 4

    # Step 1: Check for Google Cloud credentials
    print_step(1, total_steps, "Check Google Cloud Credentials")
    if not check_credentials_file():
        sys.exit(1)
    print("credentials.json found!")

    # Step 2: Authenticate with Google
    print_step(2, total_steps, "Google Authentication")
    creds = authenticate()
    print("Authenticated successfully!")

    # Step 3: Create the Google Sheet
    print_step(3, total_steps, "Create Email List Sheet")

    # Check if sheet already exists in env
    env_file = PROJECT_ROOT / ".env.local"
    existing_sheet_id = None
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                if line.strip().startswith("GOOGLE_SHEETS_ID="):
                    existing_sheet_id = line.strip().split("=", 1)[1].strip('"').strip("'")

    if existing_sheet_id:
        print(f"Sheet ID already configured: {existing_sheet_id}")
        response = input("Create a new sheet anyway? (y/N): ").strip().lower()
        if response != "y":
            sheet_id = existing_sheet_id
            print("Using existing sheet.")
        else:
            sheet_id = create_sheet_with_headers(creds)
            print(f"New sheet created!")
    else:
        sheet_id = create_sheet_with_headers(creds)
        print(f"Sheet created!")

    print(f"Sheet ID: {sheet_id}")
    print(f"View it at: https://docs.google.com/spreadsheets/d/{sheet_id}")

    # Step 4: Generate secrets and save config
    print_step(4, total_steps, "Save Configuration")

    # Generate unsubscribe secret
    unsub_secret = secrets.token_hex(32)

    # Update .env.local
    update_env_file("GOOGLE_SHEETS_ID", sheet_id)
    update_env_file("UNSUBSCRIBE_SECRET", unsub_secret)

    print(f"Configuration saved to {env_file}")

    # Summary
    print("\n" + "=" * 60)
    print("  Setup Complete!")
    print("=" * 60)
    print(f"""
What was set up:
  - Google OAuth token saved to {OAUTH_TOKEN_FILE}
  - Google Sheet created: https://docs.google.com/spreadsheets/d/{sheet_id}
  - GOOGLE_SHEETS_ID added to .env.local
  - UNSUBSCRIBE_SECRET generated and added to .env.local

Next steps:
  1. Import existing contacts:
     python tools/csv_importer.py path/to/contacts.csv

  2. Run your first Gmail scan:
     python tools/run_scan.py --dry-run

  3. For the website API routes (subscribe/unsubscribe), you'll also need:
     - A Google service account key (for server-side Vercel use)
     - Set GOOGLE_SERVICE_ACCOUNT_KEY in Vercel environment variables

  4. Make sure ANTHROPIC_API_KEY is set in .env.local for AI classification
""")


if __name__ == "__main__":
    main()
