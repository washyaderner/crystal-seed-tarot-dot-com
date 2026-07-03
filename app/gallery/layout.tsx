import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from Crystal Seed Tarot readings, parties, and events around Portland and Vancouver. The settings, the spreads, and the moments.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery | Crystal Seed Tarot",
    description:
      "Photos from Crystal Seed Tarot readings, parties, and events around Portland and Vancouver.",
    url: "/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
