"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Gift, ChevronLeft, ChevronRight, Users, DollarSign, TrendingUp, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/admin"

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  const fetchData = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "15" })
    if (statusFilter) params.set("status", statusFilter)
    const [listRes, analyticsRes] = await Promise.all([
      fetch(`/api/v1/admin/affiliates/list?${params}`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/v1/admin/affiliates/analytics", { headers: { Authorization: `Bearer ${token}` } }),
    ])
    const listData = await listRes.json()
    const analyticsData = await analyticsRes.json()
    setAffiliates(listData.affiliates || listData.items || [])
    setTotal(listData.total || 0)
    setPages(listData.pages || 1)
    setAnalytics(analyticsData)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [page, statusFilter])

  if (loading && !affiliates.length) {
    return <div className="text-center py-12 text-white/30">Loading...</div>
  }

  const analyticsCards = analytics ? [
    { label: "Total Affiliates", value: analytics.total || 0, icon: Users },
    { label: "Pending", value: analytics.pending || 0, icon: AlertTriangle },
    { label: "Approved", value: analytics.approved || 0, icon: CheckCircle },
    { label: "Total Payouts", value: analytics.totalCommissionsPaid || 0, icon: DollarSign, isCurrency: true },
  ] : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Affiliates</h1>
        <p className="text-white/40 text-sm mt-1">Manage affiliate program and payouts</p>
      </div>

      {analyticsCards.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="glass-card rounded-2xl p-4 border border-white/5">
                <Icon className="w-4 h-4 text-gold mb-2" />
                <p className="text-lg font-bold text-white">
                  {stat.isCurrency ? formatCurrency(stat.value) : stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex gap-2">
        {["", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-gold/20 text-gold border border-gold/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>
            {s || "All"}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/40 font-medium px-4 py-3">Affiliate</th>
                <th className="text-left text-xs text-white/40 font-medium px-4 py-3">Tier</th>
                <th className="text-center text-xs text-white/40 font-medium px-4 py-3">Status</th>
                <th className="text-center text-xs text-white/40 font-medium px-4 py-3">Referrals</th>
                <th className="text-center text-xs text-white/40 font-medium px-4 py-3">Earnings</th>
                <th className="text-left text-xs text-white/40 font-medium px-4 py-3">Joined</th>
                <th className="text-right text-xs text-white/40 font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-white/30">No affiliates found</td></tr>
              ) : affiliates.map((aff: any) => (
                <tr key={aff.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm text-white font-medium">{aff.firstName} {aff.lastName}</p>
                    <p className="text-xs text-white/40">{aff.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="gold">{aff.commissionTier}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={aff.status === "APPROVED" ? "gold" : aff.status === "PENDING" ? "dark" : "outline"}>
                      {aff.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-white">{aff.totalReferrals || 0}</td>
                  <td className="px-4 py-3 text-center text-sm text-white">{formatCurrency(aff.totalEarnings || 0)}</td>
                  <td className="px-4 py-3"><span className="text-xs text-white/40">{formatRelativeTime(aff.createdAt)}</span></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/affiliates/${aff.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs text-gold hover:bg-gold/10 transition-all">
                        Manage
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page ? "bg-gold/20 text-gold" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page >= pages}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
