#!/usr/bin/env python3
"""Generate an unsubscribe link for a given email address.

Usage:
    python tools/generate_unsubscribe.py someone@example.com
"""

import hashlib
import hmac
import sys

from config import get_site_url, get_unsubscribe_secret


def generate_token(email: str) -> str:
    """Generate an HMAC-SHA256 token for the given email."""
    secret = get_unsubscribe_secret()
    return hmac.new(
        secret.encode(), email.lower().encode(), hashlib.sha256
    ).hexdigest()


def generate_link(email: str) -> str:
    """Generate the full unsubscribe URL for the given email."""
    token = generate_token(email)
    site_url = get_site_url().rstrip("/")
    return f"{site_url}/api/unsubscribe?token={token}"


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python tools/generate_unsubscribe.py <email@example.com>")
        sys.exit(1)

    email = sys.argv[1]
    link = generate_link(email)

    print(f"\nUnsubscribe link for {email}:")
    print(f"  {link}")
    print(f"\nPaste this at the bottom of your emails to that contact.")
