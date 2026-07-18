import type { Metadata } from "next";
import Image from "next/image";
import { EVENT } from "./event";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: `${EVENT.title} — Beginner's Tarot Class`,
  description: `${EVENT.dateLabel}, ${EVENT.timeLabel} at ${EVENT.venue}. A beginner's tarot class with Holly Cole. $${EVENT.price}. Sign up to claim your spot.`,
  alternates: { canonical: EVENT.path },
  openGraph: {
    title: `${EVENT.title} · Beginner's Tarot Class with Holly Cole`,
    description: `${EVENT.dateLabel} · ${EVENT.timeLabel} · ${EVENT.venue}, Portland. $${EVENT.price}. Limited space — claim your spot.`,
    url: EVENT.path,
    images: [{ url: EVENT.flyer, width: 1080, height: 1440, alt: EVENT.title }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${EVENT.title} · Tarot Class with Holly Cole`,
    description: `${EVENT.dateLabel} · ${EVENT.venue}, Portland. $${EVENT.price}.`,
    images: [EVENT.flyer],
  },
};

export default function MagicOfTarotPage() {
  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          {/* Flyer */}
          <div className="mx-auto w-full max-w-sm md:max-w-none">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/15 shadow-lg shadow-purple-900/40">
              <Image src={EVENT.flyer} alt={`${EVENT.title} flyer`} fill priority
                className="object-cover" sizes="(max-width: 768px) 100vw, 480px" />
            </div>
          </div>

          {/* Details + signup */}
          <div className="flex flex-col justify-center">
            <p className="text-sm uppercase tracking-[0.3em] text-purple-200">Crystal Seed Tarot Presents</p>
            <h1 className="mt-2 font-serif text-4xl text-white md:text-5xl">{EVENT.title}</h1>
            <p className="mt-1 font-serif text-xl italic text-amber-100/90">{EVENT.subtitle}</p>

            <dl className="mt-6 space-y-2 text-white/90">
              <div className="flex gap-3"><dt className="w-20 text-purple-200">When</dt><dd>{EVENT.dateLabel}</dd></div>
              <div className="flex gap-3"><dt className="w-20 text-purple-200">Time</dt><dd>{EVENT.timeLabel}</dd></div>
              <div className="flex gap-3"><dt className="w-20 text-purple-200">Where</dt><dd>{EVENT.venue}<br /><span className="text-white/70">{EVENT.address}</span></dd></div>
              <div className="flex gap-3"><dt className="w-20 text-purple-200">Cost</dt><dd>${EVENT.price}</dd></div>
            </dl>

            <p className="mt-5 text-white/80">
              Take a journey through the cards with expert tarot reader Holly Cole. With twenty years of
              experience, she breaks down the systems of Tarot to make them easy to understand. You&rsquo;ll cover
              the suits and numerology, reversals, working with both sides of the deck, how to give a 3-card
              reading, and hands-on partner practice.
            </p>

            <div className="mt-7 rounded-xl border border-white/15 bg-black/20 p-5 backdrop-blur-md md:frosted-card">
              <h2 className="mb-4 font-serif text-2xl text-white">Claim your spot</h2>
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
