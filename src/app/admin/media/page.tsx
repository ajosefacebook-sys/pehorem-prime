"use client"

import { useEffect, useState } from "react"
import { Image, Upload, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/admin"

export default function AdminMediaPage() {
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  const fetchMedia = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "30" })
    const res = await fetch(`/api/admin/media?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setItems(data.items || [])
    setTotal(data.total || 0)
    setPages(data.pages || 1)
    setLoading(false)
  }

  useEffect(() => { fetchMedia() }, [page])

  const handleAddUrl = async () => {
    const url = prompt("Enter media URL:")
    const name = prompt("Enter media name:")
    if (!url || !name) return
    const type = url.match(/\.(png|jpg|jpeg|gif|webp|svg|mp4|webm|pdf)$/i)?.[1] || "unknown"
    await fetch("/api/admin/media", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ url, name, type }),
    })
    fetchMedia()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white">Media Library</h1>
          <p className="text-white/40 text-xs sm:text-sm mt-1">{total} files</p>
        </div>
        <Button variant="gold" size="sm" onClick={handleAddUrl} className="w-full sm:w-auto shrink-0">
          <Upload className="w-4 h-4 mr-1.5 shrink-0" /> Add Media URL
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 sm:py-12 text-white/30 text-sm">Loading...</div>
        ) : items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16 text-white/30">
            <Image className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm">No media files</p>
            <p className="text-[10px] sm:text-xs mt-1">Click "Add Media URL" to add files</p>
          </div>
        ) : items.map((media: any) => (
          <div key={media.id} className="group relative glass-card rounded-xl border border-white/5 overflow-hidden">
            <div className="aspect-square bg-dark-300 flex items-center justify-center overflow-hidden">
              {media.type?.startsWith("image") ? (
                <img src={media.url} alt={media.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="flex flex-col items-center text-white/30">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="text-[9px] sm:text-[10px] mt-1">{media.type}</span>
                </div>
              )}
            </div>
            <div className="p-1.5 sm:p-2">
              <p className="text-[9px] sm:text-[10px] text-white/60 truncate">{media.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <p className="text-[8px] sm:text-[9px] text-white/30">{formatRelativeTime(media.createdAt)}</p>
                {media.size && (
                  <>
                    <span className="text-[8px] text-white/20">·</span>
                    <p className="text-[8px] sm:text-[9px] text-white/30">{media.size}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
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
