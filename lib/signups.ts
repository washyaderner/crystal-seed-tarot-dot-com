import { google } from "googleapis";
import { createHmac } from "crypto";
import { EVENT } from "@/app/events/magic-of-tarot/event";

// Class signups are stored in the SAME Google Sheet the site's newsletter uses
// (so attendees land on Holly's list), tagged with EVENT.tag for counting.
const SHEET = "Sheet1";
const RANGE = `${SHEET}!A:H`;
// Columns: [email, name, source, timestamp, tag, status, token, notes]

function sheetsClient() {
  const keyB64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyB64) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not set");
  const credentials = JSON.parse(Buffer.from(keyB64, "base64").toString("utf-8"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

function sheetId() {
  const id = process.env.GOOGLE_SHEETS_ID;
  if (!id) throw new Error("GOOGLE_SHEETS_ID not set");
  return id;
}

export function subToken(email: string) {
  const secret = process.env.UNSUBSCRIBE_SECRET || "crystal-seed";
  return createHmac("sha256", secret).update(email.toLowerCase()).digest("hex");
}

async function allRows(): Promise<string[][]> {
  const res = await sheetsClient().spreadsheets.values.get({
    spreadsheetId: sheetId(),
    range: RANGE,
  });
  return (res.data.values as string[][]) || [];
}

/** Unique attendees signed up for this class (the "attending so far" count). */
export async function countSignups(): Promise<number> {
  const rows = await allRows();
  const emails = new Set<string>();
  for (const r of rows) {
    if ((r[4] || "") === EVENT.tag && r[0]) emails.add(r[0].toLowerCase());
  }
  return emails.size;
}

export async function alreadySignedUp(email: string): Promise<boolean> {
  const rows = await allRows();
  const e = email.toLowerCase();
  return rows.some((r) => (r[0] || "").toLowerCase() === e && (r[4] || "") === EVENT.tag);
}

export async function appendSignup(name: string, email: string, prepay: boolean) {
  const now = new Date().toISOString();
  const status = prepay ? "signed_up_prepay_pending" : "signed_up";
  const notes = `${EVENT.title} @ ${EVENT.venue} ${EVENT.dateLabel} | prepay:${prepay ? "pending" : "no"}`;
  const row = [
    email.toLowerCase(),
    name,
    "magic_of_tarot_class",
    now,
    EVENT.tag,
    status,
    subToken(email),
    notes,
  ];
  await sheetsClient().spreadsheets.values.append({
    spreadsheetId: sheetId(),
    range: RANGE,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

/** Flip a signup's status to "prepaid" after a successful Stripe payment. */
export async function markPrepaid(email: string): Promise<boolean> {
  const rows = await allRows();
  const e = email.toLowerCase();
  for (let i = 0; i < rows.length; i++) {
    if ((rows[i][0] || "").toLowerCase() === e && (rows[i][4] || "") === EVENT.tag) {
      await sheetsClient().spreadsheets.values.update({
        spreadsheetId: sheetId(),
        range: `${SHEET}!F${i + 1}`,
        valueInputOption: "RAW",
        requestBody: { values: [["prepaid"]] },
      });
      return true;
    }
  }
  return false;
}

// ---------- email (FormSubmit.co — the same no-credential service the site's contact form uses) ----------
// One POST both notifies Holly (the target inbox) and auto-responds to the attendee (_autoresponse).
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://crystalseedtarot.com";

async function formSubmit(fields: Record<string, string>) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(EVENT.notifyEmail)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: SITE_URL,
      Referer: `${SITE_URL}${EVENT.path}`,
    },
    body: JSON.stringify({ _captcha: "false", ...fields }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || (data.success !== "true" && data.success !== true)) {
    throw new Error(`FormSubmit failed: ${data.message || res.status}`);
  }
}

function attendeeText(name: string) {
  return (
    `Hi ${name},\n\n` +
    `You're signed up for ${EVENT.title} — a beginner's tarot class with Holly Cole.\n\n` +
    `  When:  ${EVENT.dateLabel}, ${EVENT.timeLabel}\n` +
    `  Where: ${EVENT.venue}, ${EVENT.address}\n` +
    `  Cost:  $${EVENT.price} (pay at the door, or prepay online)\n\n` +
    `Limited space, so thanks for claiming your spot. See you there!\n\n` +
    `— Holly Cole, Crystal Seed Tarot`
  );
}

/** New signup: emails Holly (subject names Sinister Coffee + count) and auto-confirms the attendee. */
export async function notifySignup(name: string, email: string, count: number, prepay: boolean) {
  await formSubmit({
    name,
    email, // lowercase: FormSubmit keys reply-to + autoresponse off this field
    Prepay: prepay ? "Yes (started checkout)" : "No — paying at the door",
    "Attending so far": String(count),
    _replyto: email,
    _subject: `New signup: ${EVENT.title} at Sinister Coffee — ${count} attending`,
    _template: "table",
    _autoresponse: attendeeText(name),
  });
}

/** Prepayment received: confirm to the attendee + let Holly know it's paid. */
export async function notifyPaid(name: string, email: string) {
  await formSubmit({
    name,
    email,
    Prepay: "PAID $30",
    _subject: `Prepaid: ${EVENT.title} at Sinister Coffee — ${name}`,
    _template: "table",
    _autoresponse:
      `Hi ${name},\n\nYour $${EVENT.price} prepayment for ${EVENT.title} is received and your spot is confirmed.\n\n` +
      `  ${EVENT.dateLabel}, ${EVENT.timeLabel}\n  ${EVENT.venue}, ${EVENT.address}\n\nSee you there!\n— Holly Cole, Crystal Seed Tarot`,
  });
}
