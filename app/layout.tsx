import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
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
          <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
            <Navigation />
          </header>

          {/* Main content */}
          <main className="flex-1 relative z-10">{children}</main>

          {/* Footer section */}
          <footer className="bg-black/40 backdrop-blur-md border-t border-white/20 py-8 mt-auto relative z-20">
            <div className="container mx-auto px-4">
              <div className="flex justify-center items-center">
                <p className="text-white/80 text-sm">
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
