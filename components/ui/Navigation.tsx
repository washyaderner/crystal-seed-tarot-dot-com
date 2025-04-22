"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile when component mounts and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Define base and active link styles
  const baseLinkStyle =
    "transition-all duration-300 hover:text-white hover:tracking-wider hover:scale-110 origin-left";
  const activeLinkStyle = `text-white font-extrabold ${baseLinkStyle}`; // Bold text WITH animations
  const inactiveLinkStyle = `text-white/70 ${baseLinkStyle}`;

  // Mobile menu items
  const mobileMenuItemStyle = "py-5 text-center text-lg border-b border-white/10";

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
    <nav className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-serif text-white mb-2 md:mb-0 transition-all duration-300 hover:scale-105"
        >
          Crystal Seed Tarot
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={
                  pathname === link.href ? activeLinkStyle : inactiveLinkStyle
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown - Only this needs a solid black background */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-black flex flex-col pt-4 pb-8 animate-in slide-in-from-top duration-300">
          <ul className="flex flex-col w-full">
            {navLinks.map((link) => (
              <li key={link.href} className={mobileMenuItemStyle}>
                <Link
                  href={link.href}
                  className={
                    pathname === link.href 
                      ? "text-white font-extrabold text-xl"
                      : "text-white text-xl"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
