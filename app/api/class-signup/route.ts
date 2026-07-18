import { NextRequest, NextResponse } from "next/server";
import { EVENT } from "@/app/events/magic-of-tarot/event";
import { appendSignup, alreadySignedUp, countSignups, sendMail } from "@/lib/signups";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ORIGINS = [
  "https://crystalseedtarot.com",
  "https://www.crystalseedtarot.com",
  "http://localhost:3000",
];

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin") || "";
    const ok = ORIGINS.some((o) => origin.startsWith(o)) || origin.endsWith(".vercel.app");
    if (origin && !ok) return NextResponse.json({ ok: false, error: "Bad origin" }, { status: 403 });

    const body = await request.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const prepay = !!body.prepay;

    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    }

    const existing = await alreadySignedUp(email);
    if (!existing) {
      await appendSignup(name, email, prepay);
    }
    const count = await countSignups();

    if (!existing) {
      // Attendee confirmation
      await safeSend(email, `You're signed up: ${EVENT.title} at ${EVENT.venue}`, attendeeHtml(name, prepay));
      // Holly notification — subject mentions Sinister Coffee + running count
      await safeSend(
        EVENT.notifyEmail,
        `New signup: ${EVENT.title} at Sinister Coffee — ${count} attending`,
        hollyHtml(name, email, count, prepay)
      );
    }

    let checkoutUrl: string | null = null;
    if (prepay) checkoutUrl = await createCheckout(email, name);

    return NextResponse.json({ ok: true, count, already: existing, checkoutUrl });
  } catch (err) {
    console.error("class-signup error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again, or email crystalseedtarot@gmail.com." },
      { status: 500 }
    );
  }
}

// Emails should never break the signup — log and continue.
async function safeSend(to: string, subject: string, html: string) {
  try {
    await sendMail(to, subject, html);
  } catch (e) {
    console.error("email send failed:", to, e);
  }
}

// Stripe Checkout via REST (no SDK). Returns null if Stripe isn't configured yet
// (so RSVP still works before the key is added — prepay just stays unavailable).
async function createCheckout(email: string, name: string): Promise<string | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const base = (process.env.NEXT_PUBLIC_BASE_URL || "https://crystalseedtarot.com").replace(/\/$/, "");
  const p = new URLSearchParams();
  p.set("mode", "payment");
  p.set("success_url", `${base}${EVENT.path}/confirmed?session_id={CHECKOUT_SESSION_ID}`);
  p.set("cancel_url", `${base}${EVENT.path}?prepay=canceled`);
  p.set("customer_email", email);
  p.set("line_items[0][quantity]", "1");
  p.set("line_items[0][price_data][currency]", "usd");
  p.set("line_items[0][price_data][unit_amount]", String(EVENT.price * 100));
  p.set("line_items[0][price_data][product_data][name]", `${EVENT.title} — ${EVENT.dateLabel}`);
  p.set("line_items[0][price_data][product_data][description]", `${EVENT.timeLabel} · ${EVENT.venue}`);
  p.set("metadata[email]", email);
  p.set("metadata[name]", name);
  p.set("metadata[event]", EVENT.tag);
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: p.toString(),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("stripe checkout error:", data?.error?.message || data);
    return null;
  }
  return data.url || null;
}

// ---------- email templates ----------
const wrap = (inner: string) => `
<div style="background:#0f0a1e;padding:28px 0;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:520px;margin:0 auto;background:#1a1030;border:1px solid rgba(231,197,131,.35);border-radius:10px;overflow:hidden;">
    <div style="padding:26px 30px 8px;text-align:center;">
      <div style="color:#c9a3e6;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Crystal Seed Tarot</div>
      <div style="color:#e7c583;font-size:26px;margin-top:8px;">${EVENT.title}</div>
      <div style="color:#cfc2ac;font-style:italic;font-size:15px;">${EVENT.subtitle}</div>
    </div>
    <div style="padding:6px 30px 28px;color:#f2ead9;font-size:15px;line-height:1.6;">${inner}</div>
  </div>
</div>`;

const details = `
<table style="width:100%;margin:14px 0;color:#f2ead9;font-size:15px;">
  <tr><td style="padding:3px 0;color:#c9a3e6;width:80px;">When</td><td>${EVENT.dateLabel}</td></tr>
  <tr><td style="padding:3px 0;color:#c9a3e6;">Time</td><td>${EVENT.timeLabel}</td></tr>
  <tr><td style="padding:3px 0;color:#c9a3e6;">Where</td><td>${EVENT.venue}<br>${EVENT.address}</td></tr>
  <tr><td style="padding:3px 0;color:#c9a3e6;">Cost</td><td>$${EVENT.price}</td></tr>
</table>`;

function attendeeHtml(name: string, prepay: boolean) {
  const payLine = prepay
    ? `<p>You chose to prepay — if the payment page didn't finish, you can pay at the door. Either way, your spot is saved.</p>`
    : `<p>You can pay the $${EVENT.price} at the door, or prepay anytime from the signup page.</p>`;
  return wrap(`
    <p>Hi ${escapeHtml(name)},</p>
    <p>You're signed up for <strong>${EVENT.title}</strong> with Holly Cole. Here are the details:</p>
    ${details}
    ${payLine}
    <p>Limited space, so thanks for claiming your spot. See you there!</p>
    <p style="color:#cfc2ac;">— Holly Cole, Crystal Seed Tarot</p>
  `);
}

function hollyHtml(name: string, email: string, count: number, prepay: boolean) {
  return wrap(`
    <p><strong>New signup for The Magic of Tarot at Sinister Coffee.</strong></p>
    <table style="width:100%;margin:12px 0;color:#f2ead9;font-size:15px;">
      <tr><td style="padding:3px 0;color:#c9a3e6;width:110px;">Name</td><td>${escapeHtml(name)}</td></tr>
      <tr><td style="padding:3px 0;color:#c9a3e6;">Email</td><td>${escapeHtml(email)}</td></tr>
      <tr><td style="padding:3px 0;color:#c9a3e6;">Prepay</td><td>${prepay ? "Yes (started checkout)" : "No — paying at the door"}</td></tr>
    </table>
    <p style="font-size:20px;color:#e7c583;"><strong>${count}</strong> attending so far.</p>
    <p style="color:#cfc2ac;font-size:13px;">They've been added to your email list.</p>
  `);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
