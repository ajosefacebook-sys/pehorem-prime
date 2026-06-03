"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, Building2, Car, FileText, MessageSquare,
  Image, Settings, Shield, BarChart3, LogOut, Menu, X, ChevronDown,
  Gift, TrendingUp
} from "lucide-react"
import { useState, useEffect } from "react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  {
    label: "Listings", icon: Building2, children: [
      { href: "/admin/listings?type=properties", label: "Properties", icon: Building2 },
      { href: "/admin/listings?type=vehicles", label: "Vehicles", icon: Car },
    ]
  },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare, badge: "unread" },
  { href: "/admin/boosts", label: "Boost Listings", icon: TrendingUp, badge: "boost" },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/affiliates", label: "Affiliates", icon: Gift },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/audit-log", label: "Audit Log", icon: Shield },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [pendingBoosts, setPendingBoosts] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    const headers = { Authorization: `Bearer ${token}` }
    fetch("/api/admin/inquiries?read=unread&limit=1", { headers })
      .then((r) => r.json())
      .then((data) => setUnreadCount(data.total || 0))
      .catch(() => {})
    fetch("/api/admin/boosts?status=pending&limit=1", { headers })
      .then((r) => r.json())
      .then((data) => setPendingBoosts(data.total || 0))
      .catch(() => {})
  }, [pathname])

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/admin/login"
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-full w-64 bg-dark-200/95 backdrop-blur-xl border-r border-white/5 flex flex-col">
      <div className="p-5 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="PEHOREM PRIME"
            className="h-8 w-auto object-contain"
          />
          <div>
            <p className="text-sm font-semibold text-white leading-tight">PEHOREM PRIME</p>
            <p className="text-[10px] text-gold/70">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          if ("children" in item && item.children) {
            const isExpanded = expanded === item.label
            const anyChildActive = item.children.some((c) => pathname.startsWith(c.href.split("?")[0]))
            return (
              <div key={item.label}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : item.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                    anyChildActive ? "bg-gold/10 text-gold" : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-180")} />
                </button>
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                          isActive(child.href) ? "bg-gold/10 text-gold" : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <child.icon className="w-3.5 h-3.5 shrink-0" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }
          const isInquiries = item.href === "/admin/inquiries"
          const isBoosts = item.href === "/admin/boosts"
          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive(item.href!) ? "bg-gold/10 text-gold" : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isInquiries && unreadCount > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-gold text-[10px] font-bold text-dark-200 flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
              {isBoosts && pendingBoosts > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-amber-500 text-[10px] font-bold text-dark-200 flex items-center justify-center">
                  {pendingBoosts > 99 ? "99+" : pendingBoosts}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export function AdminMobileHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  const pathname = usePathname()
  const current = navItems.find(
    (item) => !("children" in item) && item.href && pathname.startsWith(item.href)
  )
  return (
    <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-dark-200/95 backdrop-blur-xl border-b border-white/5">
      <button onClick={onMenuToggle} className="text-white/60 hover:text-white p-1">
        {<Menu className="w-5 h-5" />}
      </button>
      <div>
        <p className="text-sm font-medium text-white">{current?.label || "Admin"}</p>
      </div>
    </div>
  )
}
