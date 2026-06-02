"use client"

import { useState, useEffect } from "react"
import { BarChart3, Users, Wallet, TrendingUp, Gift } from "lucide-react"

interface Analytics {
  overview: { total: number; pending: number; approved: number; rejected: number; suspended: number; commissionsPaid: number }
  topAffiliates: { id: string; firstName: string; lastName: string; email: string; totalReferrals: number; totalEarnings: number; commissionTier: string }[]
}

export default function AdminAffiliateAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch("/api/v1/admin/affiliates/analytics", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
    </div>
  )

  if (!data) return <p className="text-white/50 text-center py-20">Failed to load analytics</p>

  const { overview, topAffiliates } = data

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-gold" />
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Affiliate Analytics</h1>
          <p className="text-white/40 text-sm">Overview of affiliate program performance</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total", value: overview.total, icon: Users, color: "text-blue-400" },
          { label: "Pending", value: overview.pending, icon: Gift, color: "text-yellow-400" },
          { label: "Approved", value: overview.approved, icon: CheckIcon, color: "text-green-400" },
          { label: "Rejected", value: overview.rejected, icon: XIcon, color: "text-red-400" },
          { label: "Suspended", value: overview.suspended, icon: AlertIcon, color: "text-orange-400" },
          { label: "Paid Out", value: `₦${overview.commissionsPaid.toLocaleString()}`, icon: Wallet, color: "text-gold" },
        ].map((card) => (
          <div key={card.label} className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40 text-xs">{card.label}</span>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <p className="text-xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-6">
        <h3 className="text-sm text-white/50 mb-4">Top 10 Affiliates</h3>
        {topAffiliates.length === 0 ? (
          <p className="text-white/20 text-sm text-center py-8">No affiliates yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-4 py-3">#</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-4 py-3">Name</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-4 py-3">Email</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-4 py-3">Tier</th>
                  <th className="text-right text-white/40 text-xs uppercase tracking-wider px-4 py-3">Referrals</th>
                  <th className="text-right text-white/40 text-xs uppercase tracking-wider px-4 py-3">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {topAffiliates.map((a, i) => (
                  <tr key={a.id} className="border-b border-white/5">
                    <td className="px-4 py-3 text-white/40 text-sm">{i + 1}</td>
                    <td className="px-4 py-3 text-white text-sm">{a.firstName} {a.lastName}</td>
                    <td className="px-4 py-3 text-white/40 text-sm">{a.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${
                        a.commissionTier === "GOLD" ? "text-yellow-400" :
                        a.commissionTier === "PLATINUM" ? "text-blue-200" :
                        a.commissionTier === "SILVER" ? "text-slate-300" : "text-gray-400"
                      }`}>{a.commissionTier}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-white">{a.totalReferrals}</td>
                    <td className="px-4 py-3 text-right text-gold">₦{a.totalEarnings.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function CheckIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"/></svg> }
function XIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function AlertIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> }
