"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Link2, Users, Wallet, UserCircle, LogOut, Menu, X,
  ChevronDown, Gift,
} from "lucide-react"

const sidebarLinks = [
  { href: "/affiliate/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/affiliate/referrals", label: "Referrals", icon: Users },
  { href: "/affiliate/payouts", label: "Payouts", icon: Wallet },
  { href: "/affiliate/profile", label: "Profile", icon: UserCircle },
]

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [affiliate, setAffiliate] = useState<{ firstName: string; lastName: string } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const publicPaths = ["/affiliate/login", "/affiliate/register"]
  const isPublic = publicPaths.includes(pathname)

  useEffect(() => {
    const token = localStorage.getItem("affiliate_token")
    if (!token && !isPublic) {
      router.push("/affiliate/login")
      return
    }
    if (token) {
      fetch("/api/v1/affiliate/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.affiliate) {
            setAffiliate(data.affiliate)
            if (isPublic) router.push("/affiliate/dashboard")
          } else {
            localStorage.removeItem("affiliate_token")
            if (!isPublic) router.push("/affiliate/login")
          }
        })
        .catch(() => {
          if (!isPublic) router.push("/affiliate/login")
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("affiliate_token")
    router.push("/affiliate/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }

  if (isPublic) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#1a1f2e] border-r border-[#2a2f3e] transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#2a2f3e]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-gold to-gold-light flex items-center justify-center">
                <Gift className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-white font-bold">Affiliate</h2>
                <p className="text-white/40 text-xs">{affiliate?.firstName} {affiliate?.lastName}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-gold/10 text-gold border border-gold/20"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-[#2a2f3e]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/10 w-full transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-[#0f1117]/80 backdrop-blur-xl border-b border-[#2a2f3e]">
          <div className="flex items-center justify-between px-6 h-16">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white/50 hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <Link
                href="/"
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                Back to Main Site
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
