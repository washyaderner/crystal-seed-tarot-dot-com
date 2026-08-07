import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews & Testimonials",
  description:
    "What clients say about their readings with Crystal Seed Tarot. Real reviews from private sessions, parties, and events.",
  alternates: { canonical: "/reviews" },
  openGraph: {
    images: [
      {
        url: "/images/Background-Image-Evergreen-Spreading-Cards.webp",
        alt: "Crystal Seed Tarot",
      },
    ],
    title: "Reviews & Testimonials | Crystal Seed Tarot",
    description:
      "What clients say about their readings with Crystal Seed Tarot.",
    url: "/reviews",
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
