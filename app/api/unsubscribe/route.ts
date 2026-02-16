import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

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

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token || token.length !== 64) {
    return new NextResponse(
      html("Invalid unsubscribe link.", false),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    const sheetId = process.env.GOOGLE_SHEETS_ID;
    if (!sheetId) {
      throw new Error("GOOGLE_SHEETS_ID not set");
    }

    const auth = getServiceAccountAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // Find the contact by token (column G)
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1!A:H",
    });

    const rows = res.data.values || [];
    let found = false;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      // Column G (index 6) is the unsubscribe token
      if (row[6] === token) {
        // Update column F (index 5) to "unsubscribed"
        await sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: `Sheet1!F${i + 1}`,
          valueInputOption: "RAW",
          requestBody: { values: [["unsubscribed"]] },
        });
        found = true;
        break;
      }
    }

    if (!found) {
      return new NextResponse(
        html("This unsubscribe link is not valid or has already been used.", false),
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }

    return new NextResponse(
      html("You've been successfully unsubscribed from Crystal Seed Tarot emails.", true),
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return new NextResponse(
      html("Something went wrong. Please email crystalseedtarot@gmail.com to unsubscribe.", false),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}

function html(message: string, success: boolean): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${success ? "Unsubscribed" : "Error"} — Crystal Seed Tarot</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #1a1a2e;
      color: #e0e0e0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 2rem;
      max-width: 500px;
      text-align: center;
      backdrop-filter: blur(10px);
    }
    h1 { color: ${success ? "#a78bfa" : "#f87171"}; }
    a { color: #a78bfa; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${success ? "Unsubscribed" : "Oops"}</h1>
    <p>${message}</p>
    <p style="margin-top: 1.5rem; font-size: 0.875rem; opacity: 0.6;">
      <a href="/">Crystal Seed Tarot</a>
    </p>
  </div>
</body>
</html>`;
}
