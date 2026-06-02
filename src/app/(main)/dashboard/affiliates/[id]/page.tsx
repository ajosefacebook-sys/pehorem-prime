"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminAffiliateDetailPage() {
  const { id } = useParams()
  const [affiliate, setAffiliate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [showReject, setShowReject] = useState(false)

  const fetchDetail = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch(`/api/v1/admin/affiliates/list?limit=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    const found = data.affiliates?.find((a: any) => a.id === id)
    setAffiliate(found)
    setLoading(false)
  }

  useEffect(() => { fetchDetail() }, [id])

  const doAction = async (action: string, extra?: Record<string, string>) => {
    const token = localStorage.getItem("token")
    const method = "PATCH"
    const body = extra ? JSON.stringify(extra) : undefined

    const res = await fetch(`/api/v1/admin/affiliates/${id}/${action}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body,
    })
    const data = await res.json()
    if (res.ok) {
      setActionMsg(data.message)
      fetchDetail()
      setShowReject(false)
      setRejectReason("")
    } else {
      setActionMsg(data.error || "Action failed")
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
    </div>
  )

  if (!affiliate) return <p className="text-white/50 text-center py-20">Affiliate not found</p>

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/dashboard/affiliates" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Affiliates
      </Link>

      {actionMsg && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-blue-400 text-sm">{actionMsg}</p>
        </div>
      )}

      <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">{affiliate.firstName} {affiliate.lastName}</h1>
            <p className="text-white/40 text-sm">{affiliate.email}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            affiliate.status === "APPROVED" ? "bg-green-500/10 text-green-400" :
            affiliate.status === "REJECTED" ? "bg-red-500/10 text-red-400" :
            affiliate.status === "PENDING" ? "bg-yellow-500/10 text-yellow-400" :
            "bg-orange-500/10 text-orange-400"
          }`}>
            {affiliate.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Business", value: affiliate.businessName },
            { label: "Referral Code", value: affiliate.referralCode },
            { label: "Tier", value: affiliate.commissionTier },
            { label: "Total Clicks", value: affiliate.totalClicks },
            { label: "Total Referrals", value: affiliate.totalReferrals },
            { label: "Total Earnings", value: `₦${affiliate.totalEarnings.toLocaleString()}` },
          ].map((f) => (
            <div key={f.label} className="bg-white/5 rounded-xl p-4">
              <p className="text-white/40 text-xs">{f.label}</p>
              <p className="text-white font-medium mt-1">{f.value}</p>
            </div>
          ))}
        </div>

        {affiliate.status === "PENDING" && (
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => doAction("approve")}>
              <CheckCircle className="w-4 h-4 mr-2" /> Approve
            </Button>
            <Button variant="dark" onClick={() => setShowReject(!showReject)}>
              <XCircle className="w-4 h-4 mr-2" /> Reject
            </Button>
          </div>
        )}

        {affiliate.status !== "PENDING" && (
          <Button variant="dark" onClick={() => doAction("suspend")}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            {affiliate.status === "SUSPENDED" ? "Reinstate" : "Suspend"}
          </Button>
        )}

        {showReject && (
          <div className="mt-4 space-y-3">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 min-h-[80px]"
            />
            <Button variant="primary" onClick={() => doAction("reject", { reason: rejectReason })}>
              Confirm Rejection
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
