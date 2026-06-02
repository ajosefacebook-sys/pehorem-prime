"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Search, Building2, Car, LogIn, Gift } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Vehicles", href: "/vehicles", icon: Car },
  { label: "Advertise", href: "/advertise", icon: Search },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Affiliate", href: "/affiliate/register", icon: Gift },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "glass-nav"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="PEHOREM PRIME"
              className="h-10 sm:h-14 w-auto object-contain"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-gold rounded-xl hover:bg-gold/5 transition-all duration-300"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/5 bg-dark/95 backdrop-blur-2xl"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-gold rounded-xl hover:bg-gold/5 transition-all"
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="font-medium">{link.label}</span>
                  </Link>
                )
              })}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link href="/auth/login" onClick={() => setIsMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsMobileOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
