import Link from "next/link";
import { EVENT } from "../event";
import { markPrepaid, sendMail } from "@/lib/signups";

export const dynamic = "force-dynamic";
export const metadata = { title: `You're all set — ${EVENT.title}`, robots: { index: false } };

async function verifySession(sessionId: string) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !sessionId) return null;
  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as any;
  } catch {
    return null;
  }
}

export default async function Confirmed({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const session = await verifySession(searchParams.session_id || "");
  const paid = session?.payment_status === "paid";
  const email = session?.customer_email || session?.metadata?.email || "";

  if (paid && email) {
    try {
      await markPrepaid(email);
      await sendMail(
        email,
        `Payment received — ${EVENT.title} at ${EVENT.venue}`,
        `<div style="font-family:Georgia,serif;color:#2a2036;">
          <p>Thank you — your $${EVENT.price} prepayment for <strong>${EVENT.title}</strong> is received and your spot is confirmed.</p>
          <p>${EVENT.dateLabel}, ${EVENT.timeLabel}<br>${EVENT.venue}, ${EVENT.address}</p>
          <p>See you there!<br>— Holly Cole, Crystal Seed Tarot</p>
        </div>`
      );
    } catch (e) {
      console.error("confirm handling failed:", e);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="max-w-md rounded-xl border border-amber-300/40 bg-white/10 p-8 text-center backdrop-blur-md">
        <div className="mb-3 text-4xl">✦</div>
        <h1 className="mb-2 font-serif text-3xl text-white">
          {paid ? "Payment received!" : "You're on the list"}
        </h1>
        <p className="text-white/85">
          {paid
            ? `Your spot for ${EVENT.title} is confirmed and prepaid. A receipt is on its way to your email.`
            : `Your spot for ${EVENT.title} is saved. If your payment didn't finish, no worries — you can pay at the door.`}
        </p>
        <p className="mt-4 text-sm text-purple-200">
          {EVENT.dateLabel} · {EVENT.timeLabel}
          <br />
          {EVENT.venue}, Portland
        </p>
        <Link href="/events" className="mt-6 inline-block rounded-md border border-white/25 px-5 py-2 text-white transition hover:bg-white/10">
          Back to events
        </Link>
      </div>
    </div>
  );
}
