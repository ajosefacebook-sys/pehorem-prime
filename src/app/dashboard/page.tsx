"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Eye, MessageCircle, TrendingUp, Settings, Plus, List, BarChart3, Bell, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const sidebarLinks = [
  { label: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { label: "My Listings", icon: List, href: "/dashboard/listings" },
  { label: "Wishlist", icon: Heart, href: "/dashboard/wishlist" },
  { label: "Messages", icon: MessageCircle, href: "/dashboard/messages" },
  { label: "Analytics", icon: TrendingUp, href: "/dashboard/analytics" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

const stats = [
  { label: "Active Listings", value: "12", icon: List, change: "+2 this month" },
  { label: "Saved Items", value: "48", icon: Heart, change: "3 new this week" },
  { label: "Inquiries", value: "24", icon: MessageCircle, change: "5 unread" },
  { label: "Profile Views", value: "1,247", icon: Eye, change: "+12% vs last month" },
]

const recentActivity = [
  { action: "New inquiry on", item: "The Ivory Palm Villa", time: "2 hours ago" },
  { action: "Listing viewed", item: "Skyline Penthouse", time: "5 hours ago" },
  { action: "Added to wishlist", item: "Lamborghini Urus", time: "1 day ago" },
  { action: "Campaign ended", item: "Elysium Estate", time: "2 days ago" },
]

export default function DashboardPage() {
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
                <p className="text-white font-semibold">John Doe</p>
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
                <p className="text-white/50 text-sm mt-1">Welcome back, John. Here&apos;s your overview.</p>
              </div>
              <Link href="/dashboard/listings/new">
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

            <div className="grid lg:grid-cols-2 gap-6">
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
          </div>
        </div>
      </div>
    </section>
  )
}
