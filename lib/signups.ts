import { google } from "googleapis";
import { createHmac } from "crypto";
import { EVENT } from "@/app/events/magic-of-tarot/event";
import { sendEmail } from "@/lib/email";

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

// ---------- email (first-party Gmail SMTP as crystalseedtarot@gmail.com — see lib/email.ts) ----------

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

/** New signup: emails Holly (subject names Sinister Coffee + count) and confirms the attendee.
 *  Holly's notification throws on failure (the caller logs it); the attendee
 *  confirmation is isolated so one lane failing never kills the other. */
export async function notifySignup(name: string, email: string, count: number, prepay: boolean) {
  await sendEmail({
    to: EVENT.notifyEmail,
    subject: `New signup: ${EVENT.title} at Sinister Coffee — ${count} attending`,
    text:
      `New class signup\n\n` +
      `  Name:   ${name}\n` +
      `  Email:  ${email}\n` +
      `  Prepay: ${prepay ? "Yes (started checkout)" : "No — paying at the door"}\n\n` +
      `Attending so far: ${count}\n\n` +
      `${EVENT.title} — ${EVENT.dateLabel}, ${EVENT.timeLabel}\n` +
      `${EVENT.venue}, ${EVENT.address}`,
    replyTo: email,
  });
  try {
    await sendEmail({
      to: email,
      subject: `You're signed up: ${EVENT.title} — ${EVENT.dateLabel}`,
      text: attendeeText(name),
      replyTo: EVENT.notifyEmail,
    });
  } catch (e) {
    console.error("attendee confirmation failed:", e);
  }
}

/** Prepayment received: confirm to the attendee + let Holly know it's paid. */
export async function notifyPaid(name: string, email: string) {
  try {
    await sendEmail({
      to: EVENT.notifyEmail,
      subject: `Prepaid: ${EVENT.title} at Sinister Coffee — ${name}`,
      text:
        `${name} <${email}> prepaid $${EVENT.price} for ${EVENT.title}.\n\n` +
        `${EVENT.dateLabel}, ${EVENT.timeLabel}\n${EVENT.venue}, ${EVENT.address}`,
      replyTo: email,
    });
  } catch (e) {
    console.error("prepaid notification to Holly failed:", e);
  }
  await sendEmail({
    to: email,
    subject: `Payment received: ${EVENT.title} — your spot is confirmed`,
    text:
      `Hi ${name},\n\n` +
      `Your $${EVENT.price} prepayment for ${EVENT.title} is received and your spot is confirmed.\n\n` +
      `  ${EVENT.dateLabel}, ${EVENT.timeLabel}\n  ${EVENT.venue}, ${EVENT.address}\n\n` +
      `See you there!\n— Holly Cole, Crystal Seed Tarot`,
  });
}
