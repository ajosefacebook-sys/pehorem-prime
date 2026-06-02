"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  MousePointerClick, Users, Wallet, TrendingUp, Copy, Check,
  Gift, ArrowUpRight, Clock, ExternalLink,
} from "lucide-react"
import { getTierBadgeClass, TIER_THRESHOLDS } from "@/lib/affiliate"

interface Stats {
  totalClicks: number
  totalReferrals: number
  totalEarnings: number
  pendingPayouts: number
  withdrawable: number
  totalPaid: number
}

interface Tier {
  current: string
  nextTier: string | null
  nextTierRate: number
  nextTierNeeded: number
  referralsToNextTier: { target: string; needed: number; totalNeeded: number }
}

interface DashboardData {
  affiliate: { firstName: string; lastName: string; referralCode: string; commissionTier: string; totalClicks: number; totalReferrals: number; totalEarnings: number }
  stats: Stats
  tier: Tier
  recentReferrals: { id: string; referredEmail: string; planName: string; commissionEarned: number; status: string; createdAt: string }[]
  recentPayouts: { id: string; amount: number; status: string; createdAt: string; reference: string | null }[]
  canRequestPayout: boolean
  payoutMinimum: number
}

export default function AffiliateDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("affiliate_token")
    if (!token) return
    fetch("/api/v1/affiliate/dashboard", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const referralLink = data ? `${window.location.origin}/auth/register?ref=${data.affiliate.referralCode}` : ""

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!data) {
    return <p className="text-white/50 text-center py-20">Failed to load dashboard</p>
  }

  const { affiliate, stats, tier, recentReferrals, recentPayouts } = data
  const currentTierInfo = TIER_THRESHOLDS.find((t) => t.tier === affiliate.commissionTier)
  const progressPercent = tier.referralsToNextTier.totalNeeded > 0
    ? Math.min(100, (affiliate.totalReferrals / tier.referralsToNextTier.totalNeeded) * 100)
    : 100

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Welcome back, {affiliate.firstName}</h1>
          <p className="text-white/40 text-sm mt-1">Here&apos;s your affiliate performance overview</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTierBadgeClass(affiliate.commissionTier)}`}>
          {affiliate.commissionTier}
        </span>
      </div>

      <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-6">
        <h3 className="text-sm text-white/50 mb-3">Your Referral Link</h3>
        <div className="flex items-center gap-3">
          <input
            readOnly
            value={referralLink}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
          />
          <button
            onClick={copyLink}
            className="flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold px-4 py-3 rounded-xl text-sm transition-all border border-gold/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Clicks", value: stats.totalClicks, icon: MousePointerClick, color: "text-blue-400" },
          { label: "Total Referrals", value: stats.totalReferrals, icon: Users, color: "text-green-400" },
          { label: "Total Earnings", value: `₦${stats.totalEarnings.toLocaleString()}`, icon: Wallet, color: "text-gold" },
          { label: "Available Balance", value: `₦${stats.withdrawable.toLocaleString()}`, icon: TrendingUp, color: "text-purple-400" },
        ].map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-xs">{card.label}</span>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-6">
        <h3 className="text-sm text-white/50 mb-4">Commission Tier Progress</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-medium">{affiliate.commissionTier}</span>
          <span className="text-white/40 text-xs">
            {affiliate.totalReferrals}/{tier.referralsToNextTier.totalNeeded} referrals
          </span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
        {tier.referralsToNextTier.needed > 0 && (
          <p className="text-white/30 text-xs mt-2">
            {tier.referralsToNextTier.needed} more referrals to reach {tier.referralsToNextTier.target} ({Math.round((currentTierInfo?.rate ?? 0.05) * 100)}% &rarr; {Math.round(tier.nextTierRate * 100)}%)
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-6">
          <h3 className="text-sm text-white/50 mb-4">Recent Referrals</h3>
          {recentReferrals.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-8">No referrals yet</p>
          ) : (
            <div className="space-y-3">
              {recentReferrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white text-sm">{ref.referredEmail}</p>
                    <p className="text-white/30 text-xs">{ref.planName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold text-sm font-medium">₦{ref.commissionEarned.toLocaleString()}</p>
                    <span className={`text-xs ${ref.status === "CONVERTED" ? "text-green-400" : ref.status === "CANCELLED" ? "text-red-400" : "text-yellow-400"}`}>
                      {ref.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-6">
          <h3 className="text-sm text-white/50 mb-4">Recent Payouts</h3>
          {recentPayouts.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-8">No payouts yet</p>
          ) : (
            <div className="space-y-3">
              {recentPayouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white text-sm">₦{p.amount.toLocaleString()}</p>
                    <p className="text-white/30 text-xs">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs ${p.status === "PAID" ? "text-green-400" : p.status === "REJECTED" ? "text-red-400" : "text-yellow-400"}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
