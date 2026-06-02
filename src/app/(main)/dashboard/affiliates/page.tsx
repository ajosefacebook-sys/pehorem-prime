"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

interface Affiliate {
  id: string
  firstName: string
  lastName: string
  email: string
  businessName: string
  referralCode: string
  status: string
  commissionTier: string
  totalClicks: number
  totalReferrals: number
  totalEarnings: number
  createdAt: string
  _count: { referrals: number; payouts: number }
}

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState("")

  const fetchAffiliates = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    const params = new URLSearchParams({ page: page.toString(), limit: "20" })
    if (filter) params.set("status", filter)
    const res = await fetch(`/api/v1/admin/affiliates/list?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setAffiliates(data.affiliates || [])
    setTotalPages(data.pagination?.totalPages || 1)
    setLoading(false)
  }

  useEffect(() => { fetchAffiliates() }, [page, filter])

  const statusColor = (s: string) => {
    switch (s) {
      case "APPROVED": return "text-green-400 bg-green-500/10"
      case "REJECTED": return "text-red-400 bg-red-500/10"
      case "PENDING": return "text-yellow-400 bg-yellow-500/10"
      case "SUSPENDED": return "text-orange-400 bg-orange-500/10"
      default: return "text-white/40 bg-white/5"
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white">Affiliates</h1>
        <Users className="w-5 h-5 text-gold" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {["", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1) }}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              filter === s ? "bg-gold/10 text-gold border border-gold/20" : "bg-white/5 text-white/50 hover:text-white border border-white/10"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      ) : affiliates.length === 0 ? (
        <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-12 text-center">
          <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30">No affiliates found</p>
        </div>
      ) : (
        <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Name</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Business</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Tier</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-right text-white/40 text-xs uppercase tracking-wider px-6 py-4">Referrals</th>
                  <th className="text-right text-white/40 text-xs uppercase tracking-wider px-6 py-4">Earnings</th>
                  <th className="text-center text-white/40 text-xs uppercase tracking-wider px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((a) => (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{a.firstName} {a.lastName}</p>
                      <p className="text-white/30 text-xs">{a.email}</p>
                    </td>
                    <td className="px-6 py-4 text-white/60 text-sm">{a.businessName}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${a.commissionTier === "GOLD" ? "text-yellow-400" : a.commissionTier === "PLATINUM" ? "text-blue-200" : a.commissionTier === "SILVER" ? "text-slate-300" : "text-gray-400"}`}>
                        {a.commissionTier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColor(a.status)}`}>{a.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-white text-sm">{a.totalReferrals}</td>
                    <td className="px-6 py-4 text-right text-gold text-sm">₦{a.totalEarnings.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/dashboard/affiliates/${a.id}`}
                        className="inline-flex items-center gap-1 text-gold hover:text-gold-light text-xs transition-colors"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
              <p className="text-white/30 text-xs">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-white disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-white disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
