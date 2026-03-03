import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { createHmac } from "crypto";

function getServiceAccountAuth() {
  const keyBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyBase64) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not set");
  }
  const key = JSON.parse(Buffer.from(keyBase64, "base64").toString("utf-8"));
  return new google.auth.GoogleAuth({
    credentials: key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function generateToken(email: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) {
    throw new Error("UNSUBSCRIBE_SECRET not set");
  }
  return createHmac("sha256", secret)
    .update(email.toLowerCase())
    .digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    // Basic origin check
    const origin = request.headers.get("origin") || "";
    const allowedOrigins = [
      "https://crystalseedtarot.com",
      "https://www.crystalseedtarot.com",
      "http://localhost:3000",
    ];
    if (!allowedOrigins.some((o) => origin.startsWith(o))) {
      return NextResponse.json({ ok: true }); // silent fail, don't break anything
    }

    const body = await request.json();
    const email = body.email?.trim()?.toLowerCase();
    const name = body.name?.trim() || "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: true }); // always 200
    }

    const sheetId = process.env.GOOGLE_SHEETS_ID;
    if (!sheetId) {
      console.error("GOOGLE_SHEETS_ID not set");
      return NextResponse.json({ ok: true });
    }

    const auth = getServiceAccountAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // Check for duplicates
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1!A:A",
    });

    const existingEmails = (existing.data.values || [])
      .flat()
      .map((e: string) => e.toLowerCase());

    if (existingEmails.includes(email)) {
      return NextResponse.json({ ok: true }); // already exists, no error
    }

    // Add the contact
    const token = generateToken(email);
    const now = new Date().toISOString();
    const row = [email, name, "website_form", now, "general_interest", "active", token, "Submitted via contact form"];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:H",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ ok: true }); // never break the form UX
  }
}
