"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Building2, Users, Car, MessageSquare, CheckCircle, Clock, TrendingUp,
  DollarSign, FileText, Image, Shield, ArrowRight, Home, Mail, Zap
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/admin"

interface DashboardData {
  stats: {
    totalUsers: number; totalProperties: number; totalVehicles: number
    totalInquiries: number; unreadInquiries: number; totalBlog: number; totalMedia: number
    pendingProperties: number; pendingVehicles: number; featuredProperties: number; featuredVehicles: number
    totalListings: number; pendingApprovals: number
    vehicleInquiries: number; propertyInquiries: number
    newInquiries: number; contactedInquiries: number; pendingInquiries: number; closedInquiries: number
    totalBoosts: number; activeBoosts: number; pendingBoosts: number; expiredBoosts: number; boostRevenue: number
  }
  recentProperties: any[]
  recentVehicles: any[]
  recentUsers: any[]
  recentInquiries: any[]
}

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "from-amber-500/20" },
  contacted: { label: "Contacted", color: "from-blue-500/20" },
  pending: { label: "Pending", color: "from-violet-500/20" },
  closed: { label: "Closed", color: "from-gray-500/20" },
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const u = localStorage.getItem("user")
    if (u) setUser(JSON.parse(u))
    fetch("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  const stats = data?.stats

  const statCards = [
    { label: "Total Listings", value: stats?.totalListings || 0, icon: Building2, change: `${stats?.pendingApprovals || 0} pending`, color: "from-blue-500/20" },
    { label: "Properties", value: stats?.totalProperties || 0, icon: Building2, change: `${stats?.featuredProperties || 0} featured`, color: "from-emerald-500/20" },
    { label: "Vehicles", value: stats?.totalVehicles || 0, icon: Car, change: `${stats?.featuredVehicles || 0} featured`, color: "from-amber-500/20" },
    { label: "Users", value: stats?.totalUsers || 0, icon: Users, change: "Registered users", color: "from-violet-500/20" },
    { label: "Total Inquiries", value: stats?.totalInquiries || 0, icon: MessageSquare, change: `${stats?.unreadInquiries || 0} unread`, color: "from-rose-500/20" },
    { label: "Blog Posts", value: stats?.totalBlog || 0, icon: FileText, change: "Published articles", color: "from-cyan-500/20" },
  ]

  const inquiryBreakdown = [
    { label: "Vehicle", value: stats?.vehicleInquiries || 0, icon: Car, color: "from-amber-500/20" },
    { label: "Property", value: stats?.propertyInquiries || 0, icon: Home, color: "from-emerald-500/20" },
    { label: "Contact", value: Math.max(0, (stats?.totalInquiries || 0) - (stats?.vehicleInquiries || 0) - (stats?.propertyInquiries || 0)), icon: Mail, color: "from-blue-500/20" },
  ]

  const inquiryStatusCards = [
    { label: "New", value: stats?.newInquiries || 0, icon: Clock, color: "from-amber-500/20" },
    { label: "Contacted", value: stats?.contactedInquiries || 0, icon: MessageSquare, color: "from-blue-500/20" },
    { label: "Pending", value: stats?.pendingInquiries || 0, icon: TrendingUp, color: "from-violet-500/20" },
    { label: "Closed", value: stats?.closedInquiries || 0, icon: CheckCircle, color: "from-gray-500/20" },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <p className="text-gold text-xs sm:text-sm font-medium">Welcome back{user ? `, ${user.name}` : ""}</p>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">Admin Dashboard</h1>
        <p className="text-white/40 text-xs sm:text-sm mt-1">Overview of your marketplace platform</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} to-transparent opacity-30`} />
              <div className="relative">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-gold/10 flex items-center justify-center mb-2 sm:mb-3">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
                <p className="text-[10px] sm:text-xs text-white/40 mt-0.5">{stat.label}</p>
                <p className="text-[8px] sm:text-[10px] text-white/30 mt-1">{stat.change}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {inquiryBreakdown.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} to-transparent opacity-20`} />
              <div className="relative">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gold/10 flex items-center justify-center mb-1.5 sm:mb-2">
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold" />
                </div>
                <p className="text-base sm:text-xl font-bold text-white">{stat.value.toLocaleString()}</p>
                <p className="text-[9px] sm:text-[11px] text-white/40">{stat.label} Inquiries</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {inquiryStatusCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} to-transparent opacity-20`} />
              <div className="relative">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gold/10 flex items-center justify-center mb-1.5 sm:mb-2">
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold" />
                </div>
                <p className="text-base sm:text-xl font-bold text-white">{stat.value.toLocaleString()}</p>
                <p className="text-[9px] sm:text-[11px] text-white/40">{stat.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: "Total Boost Requests", value: stats?.totalBoosts || 0, icon: Zap, color: "from-yellow-500/20" },
          { label: "Active Boosts", value: stats?.activeBoosts || 0, icon: TrendingUp, color: "from-green-500/20" },
          { label: "Pending Approvals", value: stats?.pendingBoosts || 0, icon: Clock, color: "from-amber-500/20" },
          { label: "Expired", value: stats?.expiredBoosts || 0, icon: Clock, color: "from-gray-500/20" },
          { label: "Revenue", value: formatCurrency(stats?.boostRevenue || 0, "USD"), icon: DollarSign, color: "from-gold/20" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} to-transparent opacity-20`} />
              <div className="relative">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gold/10 flex items-center justify-center mb-1.5 sm:mb-2">
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold" />
                </div>
                <p className="text-base sm:text-xl font-bold text-white">{stat.value.toLocaleString?.() || stat.value}</p>
                <p className="text-[9px] sm:text-[11px] text-white/40">{stat.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card hover={false}>
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm sm:text-base font-display font-semibold text-white">Recent Inquiries</h2>
                <Link href="/admin/inquiries" className="text-xs text-gold hover:text-gold-light flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {data?.recentInquiries?.length ? data.recentInquiries.slice(0, 4).map((inq: any) => {
                  const listing = inq.listing
                  const thumb = listing?.images?.[0]
                  const isProperty = inq.type === "property"
                  const isVehicle = inq.type === "vehicle"
                  return (
                    <div key={inq.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3 min-w-0">
                        {thumb ? (
                          <img src={thumb} alt=""
                            className="w-9 h-9 rounded-lg object-cover shrink-0 border border-white/5"
                          />
                        ) : (
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${inq.isRead ? "bg-white/5" : "bg-gold/20"}`}>
                            {isVehicle ? <Car className="w-4 h-4 text-gold/60" /> : isProperty ? <Home className="w-4 h-4 text-gold/60" /> : <MessageSquare className="w-4 h-4 text-white/30" />}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm text-white truncate">{listing?.title || inq.name}</p>
                          <p className="text-xs text-white/40 truncate">
                            {inq.name} &middot; {inq.type}
                            {inq.status !== "new" && ` · ${inq.status}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {inq.status === "new" && <span className="w-2 h-2 rounded-full bg-gold" />}
                        <span className="text-[10px] text-white/30">{formatRelativeTime(inq.createdAt)}</span>
                      </div>
                    </div>
                  )
                }) : (
                  <p className="text-white/30 text-sm py-4 text-center">No inquiries yet</p>
                )}
              </div>
            </div>
          </Card>

          <Card hover={false}>
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm sm:text-base font-display font-semibold text-white">Recent Users</h2>
                <Link href="/admin/users" className="text-xs text-gold hover:text-gold-light flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {data?.recentUsers?.length ? data.recentUsers.slice(0, 4).map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/50 shrink-0">
                        {u.name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{u.name}</p>
                        <p className="text-xs text-white/40 truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={u.role === "admin" ? "gold" : "dark"} className="text-[10px]">{u.role}</Badge>
                      <span className="text-[10px] text-white/30">{formatRelativeTime(u.createdAt)}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-white/30 text-sm py-4 text-center">No users yet</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card hover={false}>
            <div className="p-4 sm:p-5">
              <h2 className="text-sm sm:text-base font-display font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Add Property", href: "/admin/listings?action=new&type=properties", icon: Building2 },
                  { label: "Add Vehicle", href: "/admin/listings?action=new&type=vehicles", icon: Car },
                  { label: "New Blog Post", href: "/admin/blog/new", icon: FileText },
                  { label: "Site Settings", href: "/admin/settings", icon: Shield },
                ].map((action) => {
                  const Icon = action.icon
                  return (
                    <Link key={action.href} href={action.href}
                      className="glass-card rounded-xl p-3 border border-white/5 hover:border-gold/30 hover:bg-gold/5 transition-all text-center group"
                    >
                      <Icon className="w-5 h-5 text-gold mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] text-white/60">{action.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </Card>

          <Card hover={false}>
            <div className="p-4 sm:p-5">
              <h2 className="text-sm sm:text-base font-display font-semibold text-white mb-4">Inquiry Status</h2>
              <div className="space-y-3">
                {[
                  { label: "New", value: stats?.newInquiries || 0, color: "text-amber-400" },
                  { label: "Contacted", value: stats?.contactedInquiries || 0, color: "text-blue-400" },
                  { label: "Pending", value: stats?.pendingInquiries || 0, color: "text-violet-400" },
                  { label: "Closed", value: stats?.closedInquiries || 0, color: "text-gray-400" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1.5">
                    <span className="text-white/50 text-xs sm:text-sm">{item.label}</span>
                    <span className={`font-semibold text-xs sm:text-sm ${item.color}`}>{item.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/5">
                  <Link href="/admin/inquiries" className="text-xs text-gold hover:text-gold-light flex items-center gap-1">
                    Manage Inquiries <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          <Card hover={false}>
            <div className="p-4 sm:p-5">
              <h2 className="text-sm sm:text-base font-display font-semibold text-white mb-4">Platform Overview</h2>
              <div className="space-y-3">
                {[
                  { label: "Properties", value: stats?.totalProperties || 0 },
                  { label: "Vehicles", value: stats?.totalVehicles || 0 },
                  { label: "Users", value: stats?.totalUsers || 0 },
                  { label: "Pending Approvals", value: stats?.pendingApprovals || 0 },
                  { label: "Blog Posts", value: stats?.totalBlog || 0 },
                  { label: "Media Files", value: stats?.totalMedia || 0 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1.5">
                    <span className="text-white/50 text-xs sm:text-sm">{item.label}</span>
                    <span className="text-white font-semibold text-xs sm:text-sm">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
