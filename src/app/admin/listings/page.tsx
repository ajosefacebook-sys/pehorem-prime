"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, Eye, EyeOff, Star, Trash2, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/admin"

export default function AdminListingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const type = searchParams.get("type") || "properties"
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  const fetchItems = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "15" })
    if (search) params.set("search", search)
    const res = await fetch(`/api/admin/listings/${type}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setItems(data.items || [])
    setTotal(data.total || 0)
    setPages(data.pages || 1)
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [page, type])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchItems() }

  const toggleApprove = async (id: string, current: boolean) => {
    await fetch(`/api/admin/listings/${type}/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: !current }),
    })
    fetchItems()
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await fetch(`/api/admin/listings/${type}/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !current }),
    })
    fetchItems()
  }

  const togglePaused = async (id: string, current: boolean) => {
    await fetch(`/api/admin/listings/${type}/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ isPaused: !current }),
    })
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return
    await fetch(`/api/admin/listings/${type}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchItems()
  }

  const columns = type === "properties"
    ? ["Listing", "Type", "Status", "Price", "Location", "Agent", "Date", "Actions"]
    : ["Listing", "Make/Model", "Status", "Price", "Condition", "Dealer", "Date", "Actions"]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-white capitalize">{type}</h1>
            <div className="flex gap-1">
              <button onClick={() => router.push("/admin/listings?type=properties")}
                className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${type === "properties" ? "bg-gold/20 text-gold border border-gold/30" : "bg-white/5 text-white/50 border border-white/10"}`}>
                Properties
              </button>
              <button onClick={() => router.push("/admin/listings?type=vehicles")}
                className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${type === "vehicles" ? "bg-gold/20 text-gold border border-gold/30" : "bg-white/5 text-white/50 border border-white/10"}`}>
                Vehicles
              </button>
            </div>
          </div>
          <p className="text-white/40 text-xs sm:text-sm mt-1">{total} total {type}</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
        <div className="relative flex-1 max-w-full sm:max-w-xs min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 shrink-0" />
          <input type="text" placeholder={`Search ${type}...`} value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/40" />
        </div>
        <Button type="submit" variant="outline" size="sm" className="shrink-0">Search</Button>
      </form>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-white/5">
                {columns.map((c) => (
                  <th key={c} className="text-left text-xs text-white/40 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8 sm:py-12 text-white/30 text-sm">Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 sm:py-12 text-white/30 text-sm">No {type} found</td></tr>
              ) : items.map((item: any) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 min-w-0 max-w-[140px] sm:max-w-[200px]">
                    <p className="text-xs sm:text-sm text-white font-medium truncate">{item.title}</p>
                    <p className="text-[10px] sm:text-xs text-white/40 truncate">{item.slug}</p>
                  </td>
                  {type === "properties" ? (
                    <>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap"><Badge variant="dark" className="text-[10px] sm:text-xs">{item.type}</Badge></td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap"><Badge variant={item.isApproved ? "gold" : "dark"} className="text-[10px] sm:text-xs">{item.status}</Badge></td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap"><span className="text-xs sm:text-sm text-white">{formatCurrency(item.price)}</span></td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 min-w-0 max-w-[100px]"><span className="text-[10px] sm:text-xs text-white/60 truncate block">{item.city}, {item.state}</span></td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 min-w-0 max-w-[100px]"><span className="text-[10px] sm:text-xs text-white/40 truncate block">{item.agent?.name || "—"}</span></td>
                    </>
                  ) : (
                    <>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap"><Badge variant="dark" className="text-[10px] sm:text-xs">{item.make}</Badge></td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <span className="text-[10px] sm:text-xs text-white/60">{item.model} · {item.year}</span>
                        <Badge variant={item.isApproved ? "gold" : "dark"} className="ml-1 sm:ml-2 text-[10px] sm:text-xs">{item.condition}</Badge>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap"><span className="text-xs sm:text-sm text-white">{formatCurrency(item.price)}</span></td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap"><span className="text-[10px] sm:text-xs text-white/60">{item.condition}</span></td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 min-w-0 max-w-[100px]"><span className="text-[10px] sm:text-xs text-white/40 truncate block">{item.dealer?.name || "—"}</span></td>
                    </>
                  )}
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap"><span className="text-[10px] sm:text-xs text-white/40">{formatRelativeTime(item.createdAt)}</span></td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleApprove(item.id, item.isApproved)}
                        className={`p-1.5 sm:p-2 rounded-lg transition-all shrink-0 ${item.isApproved ? "text-emerald-400 hover:bg-emerald-500/10" : "text-white/30 hover:text-white"}`}
                        title={item.isApproved ? "Unapprove" : "Approve"}>
                        {item.isApproved ? <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>
                      <button onClick={() => toggleFeatured(item.id, item.isFeatured)}
                        className={`p-1.5 sm:p-2 rounded-lg transition-all shrink-0 ${item.isFeatured ? "text-gold" : "text-white/30 hover:text-white"}`}
                        title={item.isFeatured ? "Remove Featured" : "Mark Featured"}>
                        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button onClick={() => togglePaused(item.id, item.isPaused)}
                        className={`p-1.5 sm:p-2 rounded-lg transition-all shrink-0 ${item.isPaused ? "text-amber-400" : "text-white/30 hover:text-white"}`}
                        title={item.isPaused ? "Unpause" : "Pause"}>
                        {item.isPaused ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>
                      <button onClick={() => handleDelete(item.id)}
                        className="p-1.5 sm:p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0">
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page ? "bg-gold/20 text-gold" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page >= pages}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
