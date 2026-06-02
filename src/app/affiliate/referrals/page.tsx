"use client"

import { useState, useEffect } from "react"
import { Users, ChevronLeft, ChevronRight } from "lucide-react"

interface Referral {
  id: string
  referredEmail: string
  referredName: string | null
  planName: string
  planValue: number
  commissionRate: number
  commissionEarned: number
  status: string
  createdAt: string
  convertedAt: string | null
}

export default function AffiliateReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState("")

  const fetchReferrals = async () => {
    const token = localStorage.getItem("affiliate_token")
    if (!token) return
    const params = new URLSearchParams({ page: page.toString(), limit: "20" })
    if (filter) params.set("status", filter)
    const res = await fetch(`/api/v1/affiliate/referrals?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setReferrals(data.referrals || [])
    setTotalPages(data.pagination?.totalPages || 1)
    setLoading(false)
  }

  useEffect(() => { fetchReferrals() }, [page, filter])

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Referrals</h1>
          <p className="text-white/40 text-sm mt-1">Track all your referred clients</p>
        </div>
        <Users className="w-5 h-5 text-gold" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {["", "PENDING", "CONVERTED", "CANCELLED"].map((s) => (
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
      ) : referrals.length === 0 ? (
        <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-12 text-center">
          <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30">No referrals found</p>
        </div>
      ) : (
        <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Email</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Plan</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Date</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-right text-white/40 text-xs uppercase tracking-wider px-6 py-4">Commission</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref) => (
                  <tr key={ref.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{ref.referredEmail}</p>
                      {ref.referredName && <p className="text-white/30 text-xs">{ref.referredName}</p>}
                    </td>
                    <td className="px-6 py-4 text-white/60 text-sm">{ref.planName}</td>
                    <td className="px-6 py-4 text-white/40 text-sm">{new Date(ref.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ref.status === "CONVERTED" ? "bg-green-500/10 text-green-400" :
                        ref.status === "CANCELLED" ? "bg-red-500/10 text-red-400" :
                        "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-gold text-sm font-medium">₦{ref.commissionEarned.toLocaleString()}</span>
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
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-white disabled:opacity-30"
                >
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
