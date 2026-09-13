"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavLink } from "@/components/nav-link";
import { MobileNav } from "@/components/mobile-nav";

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/events", label: "Events" },
    { href: "/videos", label: "Videos" },
    { href: "/tarotdoxa", label: "Tarotdoxa" },
    { href: "/gallery", label: "Gallery" },
    { href: "/blog", label: "Blog" },
    { href: "/reviews", label: "Reviews" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="container mx-auto px-4 py-4 overflow-visible">
      <div className="flex justify-between items-center relative">
        <Link
          href="/"
          className="text-2xl font-serif text-white transition-all duration-300 hover:scale-105 flex items-center gap-2 sm:gap-3"
        >
          {/* Brand mark: the Crystal Seed favicon art. Decorative (alt="") because the
              name follows in the same link. */}
          <Image
            src="/images/brand/crystal-seed-mark.png"
            alt=""
            width={40}
            height={40}
            className="shrink-0 rounded-lg"
            sizes="40px"
            priority
          />
          Crystal Seed Tarot
          <Image
            src="/images/2025 Thumbtack Top Pro Badge.webp"
            alt="2025 Thumbtack Top Pro"
            width={52}
            height={52}
            className="transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            sizes="52px"
            loading="lazy"
          />
          <Image
            src="/images/gigsalad-top-performer-blue.svg"
            alt="Top Performer on GigSalad"
            width={43}
            height={48}
            className="transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            loading="lazy"
          />
        </Link>

        {/* Desktop Navigation. Ten links need about 760px beside the logo, so the
            row only shows from lg (1024px); tablets get the menu button. Before this
            the row overflowed the viewport from 768 to about 850px wide. lg uses
            space-x-3 so the brand mark still fits beside the links at 1024px. */}
        <ul className="hidden lg:flex lg:space-x-3 xl:space-x-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile + tablet navigation (no inline display:block:
            it would override lg:hidden and pin the hamburger onto desktop) */}
        <div className="lg:hidden">
          <MobileNav links={navLinks} />
        </div>
      </div>
    </nav>
  );
}
