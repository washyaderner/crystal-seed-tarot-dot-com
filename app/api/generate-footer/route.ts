import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export async function POST(request: NextRequest) {
  const { email, secret } = await request.json();

  // Verify shared secret
  const expectedSecret = process.env.UNSUBSCRIBE_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const token = createHmac("sha256", expectedSecret)
    .update(normalizedEmail)
    .digest("hex");

  const unsubUrl = `https://crystalseedtarot.com/api/unsubscribe?token=${token}`;

  const footer_text = `---\nCrystal Seed Tarot | crystalseedtarot.com\nTo unsubscribe: ${unsubUrl}`;

  const footer_html = `<p style="font-size:11px;color:#999;border-top:1px solid #eee;padding-top:8px;margin-top:24px;">Crystal Seed Tarot · <a href="https://crystalseedtarot.com" style="color:#999;">crystalseedtarot.com</a><br><a href="${unsubUrl}" style="color:#999;">Unsubscribe</a></p>`;

  return NextResponse.json({
    email: normalizedEmail,
    token,
    unsubscribe_url: unsubUrl,
    footer_text,
    footer_html,
  });
}
