"use client"

import { useEffect, useState } from "react"
import { Shield, ChevronLeft, ChevronRight, Activity } from "lucide-react"
import { formatRelativeTime } from "@/lib/admin"

export default function AdminAuditLogPage() {
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "30" })
    fetch(`/api/admin/audit-log?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || [])
        setTotal(data.total || 0)
        setPages(data.pages || 1)
        setLoading(false)
      })
  }, [page])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
          <Shield className="w-4 h-4 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Audit Log</h1>
          <p className="text-white/40 text-sm mt-1">{total} total events</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/5">
        <div className="divide-y divide-white/5 max-h-[700px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 text-white/30">Loading...</div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-white/30">
              <Activity className="w-12 h-12 mb-3" />
              <p className="text-sm">No audit events yet</p>
            </div>
          ) : items.map((log: any) => (
            <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-2 h-2 rounded-full bg-gold/50 mt-2 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-gold">{log.action}</span>
                  {log.entity && <span className="text-xs text-white/40">on {log.entity}</span>}
                  {log.adminName && <span className="text-xs text-white/30">by {log.adminName}</span>}
                </div>
                {log.details && (
                  <pre className="text-[10px] text-white/30 mt-1 font-mono truncate max-w-xl">
                    {JSON.stringify(log.details)}
                  </pre>
                )}
              </div>
              <span className="text-[10px] text-white/30 shrink-0">{formatRelativeTime(log.createdAt)}</span>
            </div>
          ))}
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
