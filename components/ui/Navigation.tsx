"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()
  
  // Define base and active link styles
  const baseLinkStyle = "transition-all duration-300 hover:text-white hover:tracking-wider hover:scale-110 origin-left"
  const activeLinkStyle = "text-white text-lg font-extrabold scale-110 tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
  const inactiveLinkStyle = `text-white/70 ${baseLinkStyle}`
  
  return (
    <nav className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif text-white mb-2 md:mb-0 transition-all duration-300 hover:scale-105">
          Crystal Seed Tarot
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link 
              href="/" 
              className={pathname === "/" ? activeLinkStyle : inactiveLinkStyle}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/services" 
              className={pathname === "/services" ? activeLinkStyle : inactiveLinkStyle}
            >
              Services
            </Link>
          </li>
          <li>
            <Link 
              href="/gallery" 
              className={pathname === "/gallery" ? activeLinkStyle : inactiveLinkStyle}
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link 
              href="/blog" 
              className={pathname === "/blog" ? activeLinkStyle : inactiveLinkStyle}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link 
              href="/reviews" 
              className={pathname === "/reviews" ? activeLinkStyle : inactiveLinkStyle}
            >
              Reviews
            </Link>
          </li>
          <li>
            <Link 
              href="/about" 
              className={pathname === "/about" ? activeLinkStyle : inactiveLinkStyle}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              href="/contact" 
              className={pathname === "/contact" ? activeLinkStyle : inactiveLinkStyle}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
