import { NextRequest, NextResponse } from "next/server";
import { EVENT } from "@/app/events/magic-of-tarot/event";
import { appendSignup, alreadySignedUp, countSignups, notifySignup } from "@/lib/signups";

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
      // Notify Holly (subject names Sinister Coffee + count) and auto-confirm the attendee.
      // Never let an email hiccup break the signup — it's already recorded.
      try {
        await notifySignup(name, email, count, prepay);
      } catch (e) {
        console.error("signup notification failed:", e);
      }
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

// Stripe Checkout via REST (no SDK). Returns null if Stripe isn't configured yet,
// so RSVP still works before the key is added — prepay just stays unavailable.
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
