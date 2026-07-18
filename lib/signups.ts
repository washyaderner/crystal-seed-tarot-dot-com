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

// ---------- email (Gmail API via OAuth2 — same mechanism as the site's cron; sends as crystalseedtarot@gmail.com) ----------
function gmailClient() {
  const oauth2 = new google.auth.OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET);
  oauth2.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
  return google.gmail({ version: "v1", auth: oauth2 });
}

export async function sendMail(to: string, subject: string, html: string) {
  const sender = process.env.GMAIL_SENDER || EVENT.notifyEmail;
  const mime = [
    `From: Crystal Seed Tarot <${sender}>`,
    `To: ${to}`,
    `Reply-To: ${EVENT.notifyEmail}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "",
    html,
  ].join("\r\n");
  const raw = Buffer.from(mime).toString("base64url");
  await gmailClient().users.messages.send({ userId: "me", requestBody: { raw } });
}
