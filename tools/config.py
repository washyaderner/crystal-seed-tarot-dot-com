"""Configuration and environment variable loading for email list management tools."""

import os
from pathlib import Path

# Base paths
TOOLS_DIR = Path(__file__).parent
PROJECT_ROOT = TOOLS_DIR.parent
CREDENTIALS_DIR = TOOLS_DIR / "credentials"
DATA_DIR = TOOLS_DIR / "data"

# Google OAuth
OAUTH_CREDENTIALS_FILE = CREDENTIALS_DIR / "credentials.json"
OAUTH_TOKEN_FILE = CREDENTIALS_DIR / "token.json"
SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
]

# State tracking
LAST_SCAN_FILE = DATA_DIR / "last_scan.json"
MANUAL_REVIEW_FILE = DATA_DIR / "manual_review.json"

# Google Sheet
SHEET_NAME = "Crystal Seed Tarot — Email List"
SHEET_RANGE = "Sheet1"

# Gmail search — exclude common noise
GMAIL_EXCLUDE_SENDERS = [
    "noreply",
    "no-reply",
    "notifications",
    "mailer-daemon",
    "postmaster",
    "newsletter",
    "updates@",
    "support@google",
    "support@apple",
    "account-security",
]

GMAIL_EXCLUDE_QUERY_PARTS = [
    "from:noreply",
    "from:no-reply",
    "from:notifications",
    "from:mailer-daemon",
    "category:promotions",
    "category:social",
    "category:updates",
    "category:forums",
    "unsubscribe",  # mass emails that already have unsubscribe
]

# AI Classification
CLASSIFICATION_CATEGORIES = [
    "quote_request",
    "booking_inquiry",
    "event_inquiry",
    "tarot_student",
    "general_interest",
    "vendor_partner",
    "not_relevant",
]

BUSINESS_CONTEXT = """Crystal Seed Tarot is a tarot reading business run by Holly Nicole, based in Oregon.

Services offered:
- Tarot readings (in-person and virtual)
- Event bookings (corporate events, private parties, festivals, markets)
- Tarot teaching and workshops
- Spiritual guidance and mentoring

Common incoming emails include:
- People requesting tarot reading quotes or appointments
- Event organizers wanting to book Holly for their event
- People interested in learning tarot
- Vendors or partners reaching out for collaboration
- General interest / fans of the business
"""


def get_env(key: str, default: str | None = None) -> str:
    """Load an environment variable, checking .env.local and .env files."""
    value = os.environ.get(key)
    if value:
        return value

    # Try loading from .env.local then .env
    for env_file in [PROJECT_ROOT / ".env.local", PROJECT_ROOT / ".env"]:
        if env_file.exists():
            with open(env_file) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k == key:
                            return v

    if default is not None:
                return default

    raise ValueError(
        f"Environment variable {key} not found. "
        f"Set it in .env.local or as an environment variable."
    )


def get_sheets_id() -> str:
    return get_env("GOOGLE_SHEETS_ID")


def get_unsubscribe_secret() -> str:
    return get_env("UNSUBSCRIBE_SECRET")


def get_anthropic_api_key() -> str:
    return get_env("ANTHROPIC_API_KEY")


def get_site_url() -> str:
    return get_env("NEXT_PUBLIC_SITE_URL", "https://crystalseedtarot.com")
