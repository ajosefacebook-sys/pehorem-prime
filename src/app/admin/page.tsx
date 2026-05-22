"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Building2, Car, Users, BarChart3, Settings, Shield, CheckCircle, XCircle, TrendingUp, DollarSign, Eye, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const adminStats = [
  { label: "Total Listings", value: "12,450", icon: Building2, change: "+234 this week" },
  { label: "Active Users", value: "8,234", icon: Users, change: "+189 this week" },
  { label: "Pending Approvals", value: "23", icon: CheckCircle, change: "12 properties, 11 vehicles" },
  { label: "Ad Campaigns", value: "156", icon: TrendingUp, change: "14 active" },
  { label: "Revenue (MTD)", value: "$48,230", icon: DollarSign, change: "+12% vs last month" },
  { label: "Total Inquiries", value: "3,847", icon: MessageCircle, change: "128 unread" },
]

const quickActions = [
  { label: "Manage Listings", icon: Building2, href: "/admin/listings", color: "gold" },
  { label: "Manage Users", icon: Users, href: "/admin/users", color: "gold" },
  { label: "View Analytics", icon: BarChart3, href: "/admin/analytics", color: "gold" },
  { label: "Ad Campaigns", icon: TrendingUp, href: "/admin/ads", color: "gold" },
  { label: "Site Settings", icon: Settings, href: "/admin/settings", color: "gold" },
]

const recentListings = [
  { title: "The Ivory Palm Villa", type: "Property", status: "Pending", date: "2 hours ago" },
  { title: "Rolls-Royce Phantom VIII", type: "Vehicle", status: "Approved", date: "5 hours ago" },
  { title: "Skyline Penthouse", type: "Property", status: "Pending", date: "1 day ago" },
  { title: "Lamborghini Urus", type: "Vehicle", status: "Approved", date: "2 days ago" },
]

export default function AdminPage() {
  return (
    <section className="pt-24 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20">
              <Shield className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs text-gold font-medium">Admin Panel</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">Administration</h1>
          <p className="text-white/50 text-sm mt-1">Manage your marketplace platform</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {adminStats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-4 border border-white/5"
              >
                <Icon className="w-4 h-4 text-gold mb-2" />
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40 mb-1">{stat.label}</p>
                <p className="text-[10px] text-white/30">{stat.change}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card hover={false}>
              <div className="p-6">
                <h2 className="text-lg font-display font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Link
                        key={action.href}
                        href={action.href}
                        className="glass-card rounded-xl p-4 border border-white/5 hover:border-gold/30 hover:bg-gold/5 transition-all text-center"
                      >
                        <Icon className="w-6 h-6 text-gold mx-auto mb-2" />
                        <span className="text-xs text-white/70">{action.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </Card>

            <Card hover={false} className="mt-6">
              <div className="p-6">
                <h2 className="text-lg font-display font-semibold text-white mb-4">Recent Listings</h2>
                <div className="space-y-3">
                  {recentListings.map((listing, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-white text-sm font-medium">{listing.title}</p>
                        <p className="text-white/40 text-xs">{listing.type} · {listing.date}</p>
                      </div>
                      <Badge variant={listing.status === "Approved" ? "gold" : "dark"}>
                        {listing.status === "Approved" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {listing.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card hover={false}>
              <div className="p-6">
                <h2 className="text-lg font-display font-semibold text-white mb-4">Platform Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-white/60 text-sm">Properties</span>
                    <span className="text-white font-semibold">8,450</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-white/60 text-sm">Vehicles</span>
                    <span className="text-white font-semibold">4,000</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-white/60 text-sm">Agents</span>
                    <span className="text-white font-semibold">1,340</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-white/60 text-sm">Dealers</span>
                    <span className="text-white font-semibold">560</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-white/60 text-sm">Monthly Visitors</span>
                    <span className="text-white font-semibold">125K</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
