"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Settings as SettingsIcon } from "lucide-react"

export default function AdminSettingsPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    siteName: "", tagline: "", whatsapp: "", email: "", phone: "", address: "",
  })
  const [socialLinks, setSocialLinks] = useState("")

  useEffect(() => {
    fetch("/api/admin/settings", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setForm({
          siteName: data.siteName || "", tagline: data.tagline || "",
          whatsapp: data.whatsapp || "", email: data.email || "",
          phone: data.phone || "", address: data.address || "",
        })
        setSocialLinks(data.socialLinks ? JSON.stringify(data.socialLinks, null, 2) : "")
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    let parsedSocial: Record<string, string> = {}
    try { parsedSocial = socialLinks ? JSON.parse(socialLinks) : {} } catch { parsedSocial = {} }
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, socialLinks: parsedSocial }),
    })
    setSaving(false)
  }

  if (loading) return <div className="text-center py-12 text-white/30">Loading...</div>

  return (
    <div className="space-y-4 sm:space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
          <SettingsIcon className="w-4 h-4 text-gold" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white truncate">Site Settings</h1>
          <p className="text-white/40 text-xs sm:text-sm mt-0.5 sm:mt-1">Manage your website configuration</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl border border-white/5 p-4 sm:p-6 space-y-4 sm:space-y-5">
        <Input label="Site Name" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} className="w-full" />
        <Input label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Input label="WhatsApp Number" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full" />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full" />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm text-white/70 mb-1 sm:mb-1.5">Social Links (JSON)</label>
          <textarea value={socialLinks} onChange={(e) => setSocialLinks(e.target.value)}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/40 font-mono"
            placeholder='{"facebook": "https://...", "twitter": "https://..."}' />
        </div>
        <div className="flex justify-end pt-1 sm:pt-2">
          <Button type="submit" variant="gold" disabled={saving} className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-1.5 shrink-0" /> {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}
