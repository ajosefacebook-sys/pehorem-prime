"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Mail, Phone, Building2, Hash, Trophy, MousePointerClick, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function AdminAffiliateDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [affiliate, setAffiliate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [showReject, setShowReject] = useState(false)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  const fetchDetail = async () => {
    const res = await fetch(`/api/v1/admin/affiliates/list?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    const found = data.affiliates?.find((a: any) => a.id === id)
    setAffiliate(found)
    setLoading(false)
  }

  useEffect(() => { fetchDetail() }, [id])

  const doAction = async (action: string, extra?: Record<string, string>) => {
    const body = extra ? JSON.stringify(extra) : undefined
    const res = await fetch(`/api/v1/admin/affiliates/${id}/${action}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body,
    })
    const data = await res.json()
    if (res.ok) {
      setActionMsg(data.message || `${action} successful`)
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

  if (!affiliate) return (
    <div className="text-center py-20 text-white/40">
      <p>Affiliate not found</p>
      <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/affiliates")}>Back to Affiliates</Button>
    </div>
  )

  const statusColors: Record<string, string> = {
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    SUSPENDED: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  }

  const infoCards = [
    { label: "Business Name", value: affiliate.businessName, icon: Building2 },
    { label: "Referral Code", value: affiliate.referralCode, icon: Hash },
    { label: "Commission Tier", value: affiliate.commissionTier, icon: Trophy },
    { label: "Total Clicks", value: affiliate.totalClicks?.toLocaleString(), icon: MousePointerClick },
    { label: "Total Referrals", value: affiliate.totalReferrals?.toLocaleString(), icon: Users },
    { label: "Total Earnings", value: formatCurrency(affiliate.totalEarnings || 0), icon: DollarSign },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => router.push("/admin/affiliates")} className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Affiliates
      </button>

      {actionMsg && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-blue-400 text-sm">{actionMsg}</p>
        </div>
      )}

      <div className="glass-card rounded-2xl border border-white/5 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-xl font-bold text-gold">
              {affiliate.firstName?.charAt(0)}{affiliate.lastName?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">{affiliate.firstName} {affiliate.lastName}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-white/40"><Mail className="w-3 h-3" /> {affiliate.email}</span>
                {affiliate.phone && <span className="flex items-center gap-1 text-xs text-white/40"><Phone className="w-3 h-3" /> {affiliate.phone}</span>}
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[affiliate.status] || "bg-white/5 text-white/50"}`}>
            {affiliate.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {infoCards.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-3.5 h-3.5 text-gold" />
                  <p className="text-white/40 text-xs">{f.label}</p>
                </div>
                <p className="text-white font-medium">{f.value || "—"}</p>
              </div>
            )
          })}
        </div>

        <hr className="border-white/5 my-4" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Business Address", value: affiliate.businessAddress },
            { label: "Company Reg Number", value: affiliate.companyRegNumber },
            { label: "TIN", value: affiliate.tin },
            { label: "Bank", value: affiliate.bankName },
            { label: "Account Name", value: affiliate.bankAccountName },
            { label: "Account Number", value: affiliate.bankAccountNumber },
            { label: "Promotion Method", value: affiliate.promotionMethod },
            { label: "Joined", value: formatDate(affiliate.createdAt) },
          ].map((f) => (
            <div key={f.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">{f.label}</p>
              <p className="text-white text-sm">{f.value || "—"}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          {affiliate.status === "PENDING" && (
            <>
              <Button variant="primary" onClick={() => doAction("approve")}>
                <CheckCircle className="w-4 h-4 mr-2" /> Approve
              </Button>
              <Button variant="dark" onClick={() => setShowReject(!showReject)}>
                <XCircle className="w-4 h-4 mr-2" /> Reject
              </Button>
            </>
          )}
          {affiliate.status !== "PENDING" && (
            <Button variant="dark" onClick={() => doAction("suspend")}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              {affiliate.status === "SUSPENDED" ? "Reinstate" : "Suspend"}
            </Button>
          )}
        </div>

        {showReject && (
          <div className="mt-4 space-y-3">
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 min-h-[80px]" />
            <Button variant="primary" onClick={() => doAction("reject", { reason: rejectReason })}>
              Confirm Rejection
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
