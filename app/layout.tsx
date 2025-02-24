import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Crystal Seed Tarot",
  description: "A Crystal Clear Connection to Yourself - Helping connect you to yourself since 2008",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <div className="bg-blur"></div>
        <div className="content-wrapper flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-2xl font-serif text-white mb-2 md:mb-0">
                  Crystal Seed Tarot
                </Link>
                <ul className="flex space-x-6">
                  <li>
                    <Link href="/" className="text-white hover:text-white/80 transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="text-white hover:text-white/80 transition-colors">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/portfolio" className="text-white hover:text-white/80 transition-colors">
                      Portfolio
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-white hover:text-white/80 transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-white hover:text-white/80 transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-white hover:text-white/80 transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </header>
          <main className="flex-grow">{children}</main>
          <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-serif text-white mb-4">Crystal Seed Tarot & Healing</h3>
                  <p className="text-white/80">Helping connect you to yourself since 2008</p>
                </div>
                <div>
                  <h4 className="text-lg font-serif text-white mb-2">Services</h4>
                  <ul className="text-white/80">
                    <li>Tarot Readings – Intuitive & Spiritual Guidance</li>
                    <li>Classes & Lessons</li>
                    <li>Events – Meditations – Blogs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-serif text-white mb-2">Connect</h4>
                  <ul className="text-white/80">
                    <li>
                      <Link href="/contact" className="hover:text-white transition-colors">
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white transition-colors">
                        Facebook
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white transition-colors">
                        Instagram
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 text-center text-white/60">
                <p>&copy; {new Date().getFullYear()} Crystal Seed Tarot. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}



import './globals.css'