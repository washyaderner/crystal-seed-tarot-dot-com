import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import Anthropic from "@anthropic-ai/sdk";

// Verify cron secret to prevent unauthorized access
function verifyCron(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return false;
  }
  return true;
}

// Get Gmail OAuth2 client using Holly's refresh token
function getGmailAuth() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });
  return oauth2Client;
}

// Get Sheets service account auth
function getSheetsAuth() {
  const keyBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyBase64) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not set");
  const key = JSON.parse(Buffer.from(keyBase64, "base64").toString("utf-8"));
  return new google.auth.GoogleAuth({
    credentials: key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

// Extract sender from Gmail message headers
function extractSender(headers: Array<{ name: string; value: string }>) {
  const from = headers.find((h) => h.name.toLowerCase() === "from");
  if (!from) return { name: "", email: "" };
  const match = from.value.match(/^(.+?)\s*<(.+?)>$/);
  if (match) return { name: match[1].trim().replace(/"/g, ""), email: match[2].toLowerCase() };
  return { name: "", email: from.value.toLowerCase().trim() };
}

function extractSubject(headers: Array<{ name: string; value: string }>) {
  return headers.find((h) => h.name.toLowerCase() === "subject")?.value || "";
}

// Decode base64url email body
function decodeBody(data: string): string {
  return Buffer.from(data, "base64url").toString("utf-8");
}

function extractSnippet(payload: any, maxChars = 500): string {
  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return decodeBody(payload.body.data).slice(0, maxChars);
  }
  for (const part of payload.parts || []) {
    if (part.mimeType === "text/plain" && part.body?.data) {
      return decodeBody(part.body.data).slice(0, maxChars);
    }
    for (const sub of part.parts || []) {
      if (sub.mimeType === "text/plain" && sub.body?.data) {
        return decodeBody(sub.body.data).slice(0, maxChars);
      }
    }
  }
  return "";
}

// Classify email using Claude Haiku
async function classifyEmail(
  anthropic: Anthropic,
  senderName: string,
  senderEmail: string,
  subject: string,
  snippet: string
): Promise<{ should_add: boolean; classification: string; confidence: string; reason: string }> {
  const systemPrompt = `You are an email classifier for Crystal Seed Tarot, a tarot reading business run by Holly Nicole in Oregon. Services: tarot readings (in-person/virtual), event bookings (corporate, parties, festivals), teaching/workshops, spiritual guidance.

ADD contacts who are: requesting readings/quotes, inquiring about events, interested in lessons, vendors/partners, genuinely interested.
DON'T add: spam, automated notifications, newsletters from other businesses, personal emails from friends/family, customer support.

Valid classifications: quote_request, booking_inquiry, event_inquiry, tarot_student, general_interest, vendor_partner, not_relevant

Respond ONLY with valid JSON.`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Analyze this email:\n\nFrom: ${senderName} <${senderEmail}>\nSubject: ${subject}\nBody preview:\n${snippet.slice(0, 500)}\n\nRespond with JSON:\n{"should_add": true/false, "classification": "<category>", "confidence": "high"|"medium"|"low", "reason": "<brief explanation>"}`,
      },
    ],
  });

  let text = (response.content[0] as { type: string; text: string }).text.trim();
  if (text.startsWith("```")) {
    text = text.split("\n").slice(1).join("\n").replace(/```$/, "").trim();
  }
  return JSON.parse(text);
}

// Check for unsubscribe intent in email text
const UNSUB_PATTERN = /\b(unsubscribe|remove me|stop emailing|opt out|take me off|don'?t (want|need) (any ?more|these) emails?|please remove|no longer wish|stop sending)\b/i;

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const log: string[] = [];
  const addLog = (msg: string) => { log.push(msg); console.log(msg); };

  try {
    const sheetId = process.env.GOOGLE_SHEETS_ID!;
    const gmailAuth = getGmailAuth();
    const sheetsAuth = getSheetsAuth();
    const gmail = google.gmail({ version: "v1", auth: gmailAuth });
    const sheets = google.sheets({ version: "v4", auth: sheetsAuth });
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Get existing emails from sheet
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1!A:H",
    });
    const rows = existing.data.values || [];
    const existingEmails = new Set(
      rows.slice(1).map((r) => (r[0] || "").toLowerCase())
    );

    addLog(`Existing contacts: ${existingEmails.size}`);

    // Build Gmail query
    const excludes = [
      "-from:noreply", "-from:no-reply", "-from:notifications",
      "-from:mailer-daemon", "-category:promotions", "-category:social",
      "-category:updates", "-category:forums", "-unsubscribe",
      "-from:txt.voice.google.com",
    ];
    const query = `in:inbox ${excludes.join(" ")}`;

    // Fetch messages
    const msgList = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 10,
    });
    const messages = msgList.data.messages || [];
    addLog(`Gmail messages found: ${messages.length}`);

    let added = 0;
    let skipped = 0;
    let irrelevant = 0;

    for (const msgRef of messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: msgRef.id!,
        format: "full",
      });

      const headers = (msg.data.payload?.headers || []) as Array<{ name: string; value: string }>;
      const { name, email } = extractSender(headers);
      const subject = extractSubject(headers);

      if (existingEmails.has(email)) {
        skipped++;
        continue;
      }

      const snippet = extractSnippet(msg.data.payload) || msg.data.snippet || "";

      try {
        const result = await classifyEmail(anthropic, name, email, subject, snippet);

        if (!result.should_add || result.confidence === "low") {
          irrelevant++;
          continue;
        }

        // Add to sheet
        const { createHmac } = await import("crypto");
        const token = createHmac("sha256", process.env.UNSUBSCRIBE_SECRET!)
          .update(email)
          .digest("hex");

        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: "Sheet1!A:H",
          valueInputOption: "RAW",
          insertDataOption: "INSERT_ROWS",
          requestBody: {
            values: [[email, name, "gmail_scan", new Date().toISOString(), result.classification, "active", token, result.reason]],
          },
        });

        existingEmails.add(email);
        added++;
        addLog(`+ ${email} (${result.classification})`);
      } catch {
        continue;
      }
    }

    // Check for unsubscribe requests
    let unsubscribed = 0;
    const unsubQuery = "in:inbox {unsubscribe remove opt-out}";
    const unsubList = await gmail.users.messages.list({
      userId: "me",
      q: unsubQuery,
      maxResults: 30,
    });

    for (const msgRef of unsubList.data.messages || []) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: msgRef.id!,
        format: "full",
      });

      const headers = (msg.data.payload?.headers || []) as Array<{ name: string; value: string }>;
      const { email } = extractSender(headers);

      // Skip Holly's own emails
      if (email.includes("crystalseedtarot") || email.includes("hollymcole")) continue;

      const snippet = extractSnippet(msg.data.payload) || msg.data.snippet || "";
      const text = `${extractSubject(headers)} ${snippet}`;

      if (UNSUB_PATTERN.test(text) && existingEmails.has(email)) {
        // Find and mark as unsubscribed
        for (let i = 1; i < rows.length; i++) {
          if ((rows[i][0] || "").toLowerCase() === email && rows[i][5] !== "unsubscribed") {
            await sheets.spreadsheets.values.update({
              spreadsheetId: sheetId,
              range: `Sheet1!F${i + 1}`,
              valueInputOption: "RAW",
              requestBody: { values: [["unsubscribed"]] },
            });
            unsubscribed++;
            addLog(`- Unsubscribed: ${email}`);
            break;
          }
        }
      }
    }

    const summary = { added, skipped, irrelevant, unsubscribed, log };
    addLog(`Done: +${added} added, ${skipped} skipped, ${irrelevant} irrelevant, -${unsubscribed} unsubscribed`);

    return NextResponse.json(summary);
  } catch (error: any) {
    addLog(`Error: ${error.message}`);
    return NextResponse.json({ error: error.message, log }, { status: 500 });
  }
}
