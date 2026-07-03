import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description:
    "Book a tarot reading with Crystal Seed Tarot. Reach Holly at crystalseedtarot@gmail.com to schedule private readings, party and event readings, or lessons.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact & Booking | Crystal Seed Tarot",
    description:
      "Book a tarot reading, party or event reading, or tarot lessons with Crystal Seed Tarot.",
    url: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
