"use client"

import { useState, useEffect } from "react"
import { UserCircle, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AffiliateProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    phone: "", businessAddress: "", bankName: "", bankAccountNumber: "", bankAccountName: "",
  })

  useEffect(() => {
    const token = localStorage.getItem("affiliate_token")
    if (!token) return
    fetch("/api/v1/affiliate/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data.affiliate) {
          setProfile(data.affiliate)
          setForm({
            phone: data.affiliate.phone || "",
            businessAddress: data.affiliate.businessAddress || "",
            bankName: data.affiliate.bankName || "",
            bankAccountNumber: data.affiliate.bankAccountNumber || "",
            bankAccountName: data.affiliate.bankAccountName || "",
          })
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const token = localStorage.getItem("affiliate_token")
    const res = await fetch("/api/v1/affiliate/me", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.affiliate) {
      setProfile((prev: any) => ({ ...prev, ...data.affiliate }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!profile) return <p className="text-white/50 text-center py-20">Failed to load profile</p>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <UserCircle className="w-6 h-6 text-gold" />
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Profile</h1>
          <p className="text-white/40 text-sm">Manage your account details</p>
        </div>
      </div>

      <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-6">
        <h3 className="text-sm text-white/50 mb-4">Account Information</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "First Name", value: profile.firstName },
            { label: "Last Name", value: profile.lastName },
            { label: "Email", value: profile.email },
            { label: "Referral Code", value: profile.referralCode },
            { label: "Company Reg Number", value: profile.companyRegNumber },
            { label: "TIN", value: profile.tin },
            { label: "Status", value: profile.status },
            { label: "Tier", value: profile.commissionTier },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-white/40 text-xs mb-1">{f.label}</p>
              <p className="text-white text-sm bg-white/5 rounded-xl px-4 py-3 border border-white/5">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1f2e] rounded-2xl border border-[#2a2f3e] p-6">
        <h3 className="text-sm text-white/50 mb-4">Editable Information</h3>
        <div className="space-y-4">
          {[
            { key: "phone", label: "Phone Number", type: "tel" },
            { key: "businessAddress", label: "Business Address", type: "text" },
            { key: "bankName", label: "Bank Name", type: "text" },
            { key: "bankAccountNumber", label: "Bank Account Number", type: "text" },
            { key: "bankAccountName", label: "Bank Account Name", type: "text" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-white/60 text-xs mb-1 block">{f.label}</label>
              <input
                type={f.type}
                value={(form as any)[f.key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
              />
            </div>
          ))}
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            className="mt-4"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
