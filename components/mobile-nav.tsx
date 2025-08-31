"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  links: Array<{
    href: string
    label: string
  }>
}

export function MobileNav({ links }: MobileNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isOpen && !target.closest('.mobile-menu-container')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <div className="mobile-menu-container relative" style={{ display: 'block' }}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white bg-black border border-white/20 rounded-md hover:bg-gray-900 transition-colors"
        style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 50,
          minWidth: '44px',
          minHeight: '44px'
        }}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop - fully opaque */}
          <div 
            className="fixed inset-0 bg-black z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu - fully opaque black */}
          <div 
            className="fixed right-4 top-20 w-64 bg-black opacity-100 border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: '#000000' }}
          >
            <nav className="py-2">
              {links.map((link, index) => {
                const isActive = pathname === link.href
                return (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "block px-6 py-3 text-lg transition-all duration-200",
                        "hover:bg-gray-900 hover:text-white",
                        isActive 
                          ? "text-white font-bold bg-gray-900" 
                          : "text-white"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                    {index < links.length - 1 && (
                      <div className="mx-4 border-b border-white/20" />
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  )
}