import type React from "react";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../components/ui/Navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crystal Seed Tarot",
  description:
    "A Crystal Clear Connection to Yourself - Helping connect you to yourself since 2008",
  generator: "v0.dev",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <div className="bg-blur"></div>
        <div className="content-wrapper flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 bg-white/10 backdrop-blur-md border-b border-white/20 overflow-visible">
            <Navigation />
          </header>

          {/* Main content */}
          <main className="flex-1 relative z-10">{children}</main>

          {/* Footer section */}
          <footer className="bg-black/40 backdrop-blur-md border-t border-white/20 py-6 md:py-8 mt-auto relative z-20">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center gap-4">
                {/* Thumbtack Badge */}
                <Image
                  src="/images/2025 Thumbtack Top Pro Badge.png"
                  alt="2025 Thumbtack Top Pro"
                  width={70}
                  height={70}
                  className="transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                />
                <p className="text-white/80 text-xs md:text-sm text-center">
                  &copy; {new Date().getFullYear()} Crystal Seed Tarot. All
                  rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
