"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif text-white mb-2 md:mb-0">
          Crystal Seed Tarot
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link 
              href="/" 
              className={pathname === "/" ? "text-white" : "text-white/70 hover:text-white transition-colors duration-200"}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/services" 
              className={pathname === "/services" ? "text-white" : "text-white/70 hover:text-white transition-colors duration-200"}
            >
              Services
            </Link>
          </li>
          <li>
            <Link 
              href="/gallery" 
              className={pathname === "/gallery" ? "text-white" : "text-white/70 hover:text-white transition-colors duration-200"}
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link 
              href="/blog" 
              className={pathname === "/blog" ? "text-white" : "text-white/70 hover:text-white transition-colors duration-200"}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link 
              href="/reviews" 
              className={pathname === "/reviews" ? "text-white" : "text-white/70 hover:text-white transition-colors duration-200"}
            >
              Reviews
            </Link>
          </li>
          <li>
            <Link 
              href="/about" 
              className={pathname === "/about" ? "text-white" : "text-white/70 hover:text-white transition-colors duration-200"}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              href="/contact" 
              className={pathname === "/contact" ? "text-white" : "text-white/70 hover:text-white transition-colors duration-200"}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
} 