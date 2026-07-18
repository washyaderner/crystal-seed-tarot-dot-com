"use client";

import { useState } from "react";
import { EVENT } from "./event";

type Status = "idle" | "loading" | "done" | "error";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [prepay, setPrepay] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");
  const [count, setCount] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/class-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, prepay }),
      });
      const data = await res.json();
      if (!data.ok) {
        setStatus("error");
        setMsg(data.error || "Something went wrong. Please try again.");
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl; // off to Stripe
        return;
      }
      setCount(typeof data.count === "number" ? data.count : null);
      setStatus("done");
      setMsg(
        data.already
          ? "You're already on the list — see you there!"
          : prepay
          ? "You're signed up! Prepay isn't switched on yet, so just pay the $30 at the door. Confirmation is on its way to your inbox."
          : "You're signed up! A confirmation is on its way to your inbox."
      );
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again in a moment.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg border border-amber-300/40 bg-white/10 p-6 text-center backdrop-blur-md">
        <div className="mb-2 text-2xl font-serif text-amber-200">You&rsquo;re in ✦</div>
        <p className="text-white/90">{msg}</p>
        {count != null && (
          <p className="mt-3 text-sm text-purple-200">{count} {count === 1 ? "person" : "people"} signed up so far.</p>
        )}
      </div>
    );
  }

  const inputCls =
    "w-full rounded-md border border-white/25 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-amber-300/70 focus:bg-white/15";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-white/80">Name</label>
        <input id="name" required value={name} onChange={(e) => setName(e.target.value)}
          className={inputCls} placeholder="Your name" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-white/80">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className={inputCls} placeholder="you@email.com" autoComplete="email" />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-md border border-white/15 bg-white/5 p-3">
        <input type="checkbox" checked={prepay} onChange={(e) => setPrepay(e.target.checked)}
          className="mt-1 h-4 w-4 accent-amber-400" />
        <span className="text-sm text-white/85">
          I&rsquo;d like to prepay the <strong>${EVENT.price}</strong> now <span className="text-white/55">(optional — you can also pay at the door)</span>
        </span>
      </label>

      {status === "error" && <p className="text-sm text-red-300">{msg}</p>}

      <button type="submit" disabled={status === "loading"}
        className="w-full rounded-md bg-amber-300/90 px-6 py-3 font-semibold text-purple-950 transition hover:bg-amber-200 disabled:opacity-60">
        {status === "loading" ? "One moment…" : prepay ? `Sign up & prepay $${EVENT.price}` : "Claim my spot"}
      </button>
      <p className="text-center text-xs text-white/50">
        You&rsquo;ll get a confirmation email, and you can unsubscribe anytime.
      </p>
    </form>
  );
}
