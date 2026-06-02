"use client"

import { useState, useEffect } from "react"
import { Wallet, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Payout {
  id: string
  amount: number
  status: string
  reference: string | null
  note: string | null
  createdAt: string
  paidAt: string | null
  affiliate: { id: string; firstName: string; lastName: string; email: string; bankName: string; bankAccountNumber: string; bankAccountName: string }
}

export default function AdminAffiliatePayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [payRef, setPayRef] = useState("")
  const [payingId, setPayingId] = useState("")
  const [actionMsg, setActionMsg] = useState("")

  const fetchPayouts = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch(`/api/v1/admin/affiliates/payouts/list?page=${page}&limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setPayouts(data.payouts || [])
    setTotalPages(data.pagination?.totalPages || 1)
    setLoading(false)
  }

  useEffect(() => { fetchPayouts() }, [page])

  const markPaid = async (id: string) => {
    if (!payRef) return
    const token = localStorage.getItem("token")
    const res = await fetch(`/api/v1/admin/affiliates/payouts/${id}/pay`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ reference: payRef }),
    })
    const data = await res.json()
    if (res.ok) {
      setActionMsg("Payout marked as paid")
      setPayingId("")
      setPayRef("")
      fetchPayouts()
    } else {
      setActionMsg(data.error || "Failed")
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white">Payout Requests</h1>
        <Wallet className="w-5 h-5 text-gold" />
      </div>

      {actionMsg && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-blue-400 text-sm">{actionMsg}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      ) : payouts.length === 0 ? (
        <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-12 text-center">
          <Wallet className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30">No payout requests</p>
        </div>
      ) : (
        <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Affiliate</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Bank Details</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Amount</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Date</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-center text-white/40 text-xs uppercase tracking-wider px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{p.affiliate.firstName} {p.affiliate.lastName}</p>
                      <p className="text-white/30 text-xs">{p.affiliate.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white/60 text-xs">{p.affiliate.bankName}</p>
                      <p className="text-white/40 text-xs">{p.affiliate.bankAccountNumber} - {p.affiliate.bankAccountName}</p>
                    </td>
                    <td className="px-6 py-4 text-gold font-medium">₦{p.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-white/40 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        p.status === "PAID" ? "bg-green-500/10 text-green-400" :
                        p.status === "REJECTED" ? "bg-red-500/10 text-red-400" :
                        "bg-yellow-500/10 text-yellow-400"
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {(p.status === "PENDING" || p.status === "PROCESSING") && (
                        <div className="flex items-center gap-2 justify-center">
                          <input
                            placeholder="Ref #"
                            value={payingId === p.id ? payRef : ""}
                            onChange={(e) => { setPayingId(p.id); setPayRef(e.target.value) }}
                            className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs"
                          />
                          <button
                            onClick={() => markPaid(p.id)}
                            disabled={payingId !== p.id || !payRef}
                            className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 disabled:opacity-30"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      )}
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
