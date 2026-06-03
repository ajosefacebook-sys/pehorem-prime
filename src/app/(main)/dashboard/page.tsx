"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Eye, MessageCircle, TrendingUp, Settings, Plus, List, BarChart3, User, LogOut, Gift, Zap, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { formatRelativeTime } from "@/lib/admin"
import { formatCurrency } from "@/lib/utils"

const sidebarLinks = [
  { label: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { label: "My Listings", icon: List, href: "/dashboard" },
  { label: "Wishlist", icon: Heart, href: "/dashboard" },
  { label: "Messages", icon: MessageCircle, href: "/dashboard" },
  { label: "Analytics", icon: TrendingUp, href: "/dashboard" },
  { label: "Settings", icon: Settings, href: "/dashboard" },
  { label: "Affiliate Program", icon: Gift, href: "/affiliate/dashboard" },
]

const BOOST_STATUS_BADGE: Record<string, { label: string; variant: "gold" | "dark" | "outline" }> = {
  pending: { label: "Pending", variant: "gold" },
  approved: { label: "Approved", variant: "dark" },
  rejected: { label: "Rejected", variant: "outline" },
  suspended: { label: "Suspended", variant: "outline" },
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [boosts, setBoosts] = useState<any[]>([])
  const [loadingBoosts, setLoadingBoosts] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem("user")
    if (u) setUser(JSON.parse(u))
    const token = localStorage.getItem("token")
    if (token) {
      fetch("/api/user/boosts", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => setBoosts(data.items || []))
        .catch(() => {})
        .finally(() => setLoadingBoosts(false))
    } else {
      setLoadingBoosts(false)
    }
  }, [])

  const stats = [
    { label: "Active Listings", value: "12", icon: List, change: "+2 this month" },
    { label: "Saved Items", value: "48", icon: Heart, change: "3 new this week" },
    { label: "Inquiries", value: "24", icon: MessageCircle, change: "5 unread" },
    { label: "Boost Requests", value: String(boosts.length), icon: Zap, change: `${boosts.filter((b) => b.approvalStatus === "approved").length} active` },
  ]

  const recentActivity = [
    ...boosts.slice(0, 3).map((b) => ({
      action: b.approvalStatus === "pending" ? "Boost request pending for" : "Boost approved for",
      item: b.listing?.title || b.listingId,
      time: formatRelativeTime(b.createdAt),
    })),
    ...(boosts.length < 3 ? [{ action: "New inquiry on", item: "The Ivory Palm Villa", time: "2 hours ago" }] : []),
  ]

  return (
    <section className="pt-24 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="glass-card rounded-2xl p-4 border border-white/10 sticky top-24">
              <div className="text-center pb-4 mb-4 border-b border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 mx-auto mb-3 flex items-center justify-center border border-gold/30">
                  <User className="w-7 h-7 text-gold" />
                </div>
                <p className="text-white font-semibold">{user?.name || "John Doe"}</p>
                <p className="text-white/40 text-xs">Premium Member</p>
                <Badge variant="gold" className="mt-2">Verified Agent</Badge>
              </div>
              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
              <div className="pt-4 mt-4 border-t border-white/10">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all w-full">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">Dashboard</h1>
                <p className="text-white/50 text-sm mt-1">Welcome back{user ? `, ${user.name}` : ""}. Here&apos;s your overview.</p>
              </div>
              <Link href="/dashboard">
                <Button variant="primary" size="md">
                  <Plus className="w-4 h-4 mr-2" />
                  New Listing
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-5 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="w-5 h-5 text-gold" />
                      <span className="text-xs text-white/40">{stat.change}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/40">{stat.label}</p>
                  </motion.div>
                )
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card hover={false}>
                <div className="p-6">
                  <h2 className="text-lg font-display font-semibold text-white mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="w-2 h-2 rounded-full bg-gold/60 mt-2 flex-shrink-0" />
                        <div>
                          <p className="text-white/70 text-sm">
                            {activity.action} <span className="text-white font-medium">{activity.item}</span>
                          </p>
                          <p className="text-white/30 text-xs mt-0.5">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card hover={false}>
                <div className="p-6">
                  <h2 className="text-lg font-display font-semibold text-white mb-4">AI Recommendations</h2>
                  <div className="space-y-4">
                    <div className="glass-card rounded-xl p-4 border border-gold/10 bg-gold/5">
                      <p className="text-sm text-white/80">
                        <span className="text-gold font-medium">Boost your listings</span> — Your property &ldquo;The Ivory Palm Villa&rdquo; has high engagement. Consider a sponsored campaign to maximize visibility.
                      </p>
                    </div>
                    <div className="glass-card rounded-xl p-4 border border-white/5">
                      <p className="text-sm text-white/60">
                        <span className="text-gold font-medium">Price optimization</span> — Market trends suggest a 5-8% price adjustment could accelerate the sale of your Lekki properties.
                      </p>
                    </div>
                    <div className="glass-card rounded-xl p-4 border border-white/5">
                      <p className="text-sm text-white/60">
                        <span className="text-gold font-medium">Complete your profile</span> — Agents with complete profiles receive 3x more inquiries. Add your portfolio and certifications.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-display font-semibold text-white">My Boosted Listings</h2>
                <span className="text-xs text-white/40">{boosts.length} request{boosts.length !== 1 ? "s" : ""}</span>
              </div>
              {loadingBoosts ? (
                <div className="text-center py-8 text-white/30 text-sm">Loading...</div>
              ) : boosts.length === 0 ? (
                <Card hover={false}>
                  <div className="p-8 text-center">
                    <Zap className="w-10 h-10 text-gold/30 mx-auto mb-3" />
                    <p className="text-white/50 text-sm">No boost requests yet</p>
                    <p className="text-white/30 text-xs mt-1">Boost your listings to increase visibility</p>
                    <Link href="/vehicles">
                      <Button variant="outline" size="sm" className="mt-4">Browse Listings</Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {boosts.map((boost) => {
                    const listing = boost.listing
                    const thumb = listing?.images?.[0]
                    const isProperty = boost.listingType === "property"
                    const statusInfo = BOOST_STATUS_BADGE[boost.approvalStatus] || BOOST_STATUS_BADGE.pending
                    const isExpired = boost.endDate && new Date(boost.endDate) < new Date()
                    const daysRemaining = boost.endDate
                      ? Math.max(0, Math.ceil((new Date(boost.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                      : null
                    return (
                      <motion.div
                        key={boost.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl border border-white/5 overflow-hidden hover:border-gold/30 transition-all"
                      >
                        {thumb && (
                          <div className="h-32 sm:h-36 overflow-hidden">
                            <img src={thumb} alt={listing?.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm text-white font-medium truncate">{listing?.title || boost.listingId}</p>
                              {listing && (
                                <p className="text-[10px] text-white/40 truncate">
                                  {isProperty ? listing.type : `${listing.make} ${listing.model}`}
                                </p>
                              )}
                            </div>
                            <Badge variant={statusInfo.variant} className="text-[9px] shrink-0">{statusInfo.label}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-white/40">
                            <span className="text-gold font-semibold">{boost.planName}</span>
                            <span>·</span>
                            <span>{formatCurrency(boost.amount, "USD")}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-white/40">
                            {boost.startDate && <span>From {new Date(boost.startDate).toLocaleDateString()}</span>}
                            {boost.endDate && <span>To {new Date(boost.endDate).toLocaleDateString()}</span>}
                          </div>
                          {daysRemaining !== null && boost.approvalStatus === "approved" && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-gold/60" />
                              <span className={`text-[10px] ${daysRemaining === 0 ? "text-red-400" : "text-gold"}`}>
                                {daysRemaining === 0 ? "Expired" : `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            {boost.paymentStatus === "verified" ? (
                              <CheckCircle className="w-3 h-3 text-green-400" />
                            ) : (
                              <XCircle className="w-3 h-3 text-amber-400" />
                            )}
                            <span className="text-[10px] text-white/40">{boost.paymentStatus === "verified" ? "Paid" : "Payment pending"}</span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
