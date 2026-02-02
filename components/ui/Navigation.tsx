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
          className="text-2xl font-serif text-white transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          Crystal Seed Tarot
          <Image
            src="/images/2025 Thumbtack Top Pro Badge.png"
            alt="2025 Thumbtack Top Pro"
            width={28}
            height={28}
            className="transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] scale-[2.25]"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile Navigation - Only visible on mobile */}
        <div className="md:hidden" style={{ display: 'block' }}>
          <MobileNav links={navLinks} />
        </div>
      </div>
    </nav>
  );
}
