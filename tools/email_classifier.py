"""AI-powered email classification using Claude Haiku.

Classifies incoming emails as business leads vs noise for Crystal Seed Tarot.
"""

import json

import anthropic

from config import BUSINESS_CONTEXT, CLASSIFICATION_CATEGORIES, get_anthropic_api_key

SYSTEM_PROMPT = f"""You are an email classifier for a tarot reading business.

{BUSINESS_CONTEXT}

Your job is to analyze incoming emails and determine if the sender should be added to the business contact/email list.

You should ADD contacts who are:
- Requesting tarot readings or quotes
- Inquiring about event bookings
- Interested in tarot lessons/workshops
- Vendors or partners reaching out for legitimate collaboration
- Genuinely interested in the business

You should NOT add:
- Spam or scam emails
- Automated notifications (shipping, receipts, account alerts)
- Marketing/newsletter emails from other businesses
- Personal emails from friends/family (unless business-related)
- Customer support responses from companies
- Social media notifications

Valid classifications: {', '.join(CLASSIFICATION_CATEGORIES)}

Respond ONLY with valid JSON. No other text."""

USER_PROMPT_TEMPLATE = """Analyze this email and determine if the sender should be added to the business contact list.

From: {sender_name} <{sender_email}>
Subject: {subject}
Body preview:
{snippet}

Respond with JSON:
{{
  "should_add": true/false,
  "classification": "<category>",
  "confidence": "high" | "medium" | "low",
  "reason": "<brief explanation>"
}}"""


def classify_email(
    sender_name: str,
    sender_email: str,
    subject: str,
    snippet: str,
) -> dict:
    """Classify an email using Claude Haiku.

    Returns:
        dict with keys: should_add, classification, confidence, reason
    """
    client = anthropic.Anthropic(api_key=get_anthropic_api_key())

    user_message = USER_PROMPT_TEMPLATE.format(
        sender_name=sender_name or "(unknown)",
        sender_email=sender_email,
        subject=subject or "(no subject)",
        snippet=snippet[:500] if snippet else "(no body)",
    )

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=256,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    # Parse the JSON response
    text = response.content[0].text.strip()

    # Handle potential markdown code blocks
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
        text = text.strip()

    result = json.loads(text)

    # Validate the response
    if result.get("classification") not in CLASSIFICATION_CATEGORIES:
        result["classification"] = "general_interest"
    if result.get("confidence") not in ("high", "medium", "low"):
        result["confidence"] = "medium"
    result.setdefault("should_add", False)
    result.setdefault("reason", "")

    return result
