"use client"

import { useEffect, useState } from "react"
import { Search, ChevronLeft, ChevronRight, Mail, CheckCheck, Trash2, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/admin"

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState("")
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  const fetchItems = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "20" })
    if (filter) params.set("read", filter)
    const res = await fetch(`/api/admin/inquiries?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setItems(data.items || [])
    setTotal(data.total || 0)
    setPages(data.pages || 1)
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [page, filter])

  const markRead = async (id: string) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: true }),
    })
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (selected?.id === id) setSelected(null)
    fetchItems()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white">Inquiries</h1>
          <p className="text-white/40 text-xs sm:text-sm mt-1">{total} total messages</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: "All", value: "" },
          { label: "Unread", value: "unread" },
          { label: "Read", value: "read" },
        ].map((f) => (
          <button key={f.value} onClick={() => { setFilter(f.value); setPage(1) }}
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f.value ? "bg-gold/20 text-gold border border-gold/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="divide-y divide-white/5 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 sm:py-12 text-white/30 text-sm">Loading...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-white/30 text-sm">No inquiries found</div>
            ) : items.map((item: any) => (
              <div
                key={item.id}
                onClick={() => { setSelected(item); if (!item.isRead) markRead(item.id) }}
                className={`p-3 sm:p-4 cursor-pointer transition-all hover:bg-white/[0.02] ${selected?.id === item.id ? "bg-gold/5 border-l-2 border-gold" : ""} ${!item.isRead ? "bg-white/[0.02]" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 ${!item.isRead ? "bg-gold/20 text-gold" : "bg-white/5 text-white/40"}`}>
                      {item.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-white font-medium truncate">{item.name}</p>
                      <p className="text-[10px] sm:text-xs text-white/40 truncate">{item.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {!item.isRead && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold shrink-0" />}
                    <span className="text-[9px] sm:text-[10px] text-white/30 whitespace-nowrap">{formatRelativeTime(item.createdAt)}</span>
                  </div>
                </div>
                <div className="mt-1.5 sm:mt-2">
                  <Badge variant="dark" className="text-[9px] sm:text-[10px]">{item.type}</Badge>
                  <p className="text-[11px] sm:text-xs text-white/50 mt-1 sm:mt-1.5 line-clamp-2">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/5">
          {selected ? (
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold/20 flex items-center justify-center text-xs sm:text-sm font-bold text-gold shrink-0">
                    {selected.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base text-white font-medium truncate">{selected.name}</p>
                    <p className="text-[11px] sm:text-xs text-white/40 truncate">{selected.email}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(selected.id)}
                  className="p-1.5 sm:p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 shrink-0">
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
              {selected.phone && (
                <p className="text-xs sm:text-sm text-white/60">📞 {selected.phone}</p>
              )}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <Badge variant="gold" className="text-[10px] sm:text-xs">{selected.type}</Badge>
                <span className="text-[9px] sm:text-[10px] text-white/30 whitespace-nowrap">{formatRelativeTime(selected.createdAt)}</span>
              </div>
              <hr className="border-white/5" />
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              <div className="flex gap-2 pt-1 sm:pt-2">
                <a href={`mailto:${selected.email}`}
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gold/10 text-gold text-[11px] sm:text-xs font-medium hover:bg-gold/20 transition-all">
                  <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-white/30">
              <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm">Select an inquiry to view</p>
            </div>
          )}
        </div>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/30">Page {page} of {pages}</span>
          <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page >= pages}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
