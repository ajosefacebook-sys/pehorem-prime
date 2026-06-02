"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, X, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Payout {
  id: string
  amount: number
  status: string
  reference: string | null
  note: string | null
  createdAt: string
  paidAt: string | null
}

export default function AffiliatePayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showRequest, setShowRequest] = useState(false)
  const [amount, setAmount] = useState("")
  const [requesting, setRequesting] = useState(false)
  const [error, setError] = useState("")
  const [canRequest, setCanRequest] = useState(false)
  const [minPayout, setMinPayout] = useState(10000)

  const fetchData = async () => {
    const token = localStorage.getItem("affiliate_token")
    if (!token) return
    setLoading(true)
    const [payoutsRes, dashRes] = await Promise.all([
      fetch(`/api/v1/affiliate/payouts?page=${page}&limit=20`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/v1/affiliate/dashboard", { headers: { Authorization: `Bearer ${token}` } }),
    ])
    const payoutsData = await payoutsRes.json()
    const dashData = await dashRes.json()
    setPayouts(payoutsData.payouts || [])
    setTotalPages(payoutsData.pagination?.totalPages || 1)
    setBalance(dashData.stats?.withdrawable || 0)
    setCanRequest(dashData.canRequestPayout || false)
    setMinPayout(dashData.payoutMinimum || 10000)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [page])

  const handleRequest = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt < minPayout) {
      setError(`Minimum payout is ₦${minPayout.toLocaleString()}`)
      return
    }
    if (amt > balance) {
      setError(`Insufficient balance. Available: ₦${balance.toLocaleString()}`)
      return
    }
    setRequesting(true)
    setError("")
    const token = localStorage.getItem("affiliate_token")
    const res = await fetch("/api/v1/affiliate/payout/request", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amt }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "Request failed")
    } else {
      setShowRequest(false)
      setAmount("")
      fetchData()
    }
    setRequesting(false)
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Payouts</h1>
          <p className="text-white/40 text-sm mt-1">Manage your earnings and withdrawals</p>
        </div>
        <Wallet className="w-5 h-5 text-gold" />
      </div>

      <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-white">₦{balance.toLocaleString()}</p>
          </div>
          <Button
            variant="primary"
            disabled={!canRequest}
            onClick={() => setShowRequest(true)}
          >
            Request Payout
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      ) : payouts.length === 0 ? (
        <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-12 text-center">
          <Wallet className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30">No payout history</p>
        </div>
      ) : (
        <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Amount</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Date Requested</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-6 py-4">Reference</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-white font-medium">₦{p.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-white/40 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        p.status === "PAID" ? "bg-green-500/10 text-green-400" :
                        p.status === "REJECTED" ? "bg-red-500/10 text-red-400" :
                        p.status === "PROCESSING" ? "bg-blue-500/10 text-blue-400" :
                        "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/40 text-sm">{p.reference || "—"}</td>
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

      <AnimatePresence>
        {showRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRequest(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Request Payout</h3>
                <button onClick={() => setShowRequest(false)} className="text-white/30 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/40 text-sm mb-2">Available: ₦{balance.toLocaleString()}</p>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min ₦${minPayout.toLocaleString()}`}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 mb-4"
              />
              {error && (
                <p className="text-red-400 text-xs mb-4 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {error}
                </p>
              )}
              <div className="flex gap-3">
                <Button variant="dark" size="lg" className="flex-1" onClick={() => setShowRequest(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="lg" className="flex-1" disabled={requesting} onClick={handleRequest}>
                  {requesting ? "Processing..." : "Submit"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
