"use client";

import Link from "next/link";
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
          className="text-2xl font-serif text-white transition-all duration-300 hover:scale-105"
        >
          Crystal Seed Tarot
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
