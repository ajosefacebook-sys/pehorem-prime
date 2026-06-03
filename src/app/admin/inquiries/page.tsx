"use client"

import { useEffect, useState } from "react"
import { Search, ChevronLeft, ChevronRight, Mail, Trash2, MessageSquare, Home, Car } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatRelativeTime } from "@/lib/admin"
import { formatCurrency } from "@/lib/utils"

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState("")
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  const fetchItems = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "20" })
    if (filter) params.set("read", filter)
    if (search) params.set("search", search)
    const res = await fetch(`/api/admin/inquiries?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setItems(data.items || [])
    setTotal(data.total || 0)
    setPages(data.pages || 1)
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [page, filter, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
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
          <p className="text-white/40 text-xs sm:text-sm mt-1">{total} total submissions</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
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
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40"
          />
          <Button type="submit" variant="gold" size="sm">
            <Search className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="divide-y divide-white/5 max-h-[600px] sm:max-h-[700px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12 text-white/30 text-sm">Loading...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-white/30 text-sm">No inquiries found</div>
            ) : items.map((item: any) => {
              const listing = item.listing
              const isProperty = item.type === "property" || item.type === "property-enquiry"
              const isVehicle = item.type === "vehicle" || item.type === "vehicle-enquiry"
              const thumb = listing?.images?.[0]
              return (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`p-3 sm:p-4 cursor-pointer transition-all hover:bg-white/[0.02] ${selected?.id === item.id ? "bg-gold/5 border-l-2 border-gold" : ""} ${!item.isRead ? "bg-white/[0.02]" : ""}`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {thumb ? (
                      <img src={thumb} alt={listing.title}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0 border border-white/5"
                      />
                    ) : (
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center shrink-0 ${!item.isRead ? "bg-gold/20" : "bg-white/5"}`}>
                        {isProperty ? <Home className="w-5 h-5 text-gold/60" /> : isVehicle ? <Car className="w-5 h-5 text-gold/60" /> : <MessageSquare className="w-5 h-5 text-white/30" />}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-white font-medium truncate">{listing?.title || item.name}</p>
                          {listing ? (
                            <p className="text-[10px] sm:text-xs text-white/40 truncate mt-0.5">
                              {isProperty ? `${listing.type} · ${listing.location}` : `${listing.make} ${listing.model} · ${listing.year}`}
                            </p>
                          ) : (
                            <p className="text-[10px] sm:text-xs text-white/40 truncate mt-0.5">{item.email}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!item.isRead && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold shrink-0" />}
                          <span className="text-[9px] sm:text-[10px] text-white/30 whitespace-nowrap">{formatRelativeTime(item.createdAt)}</span>
                        </div>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge variant={isProperty ? "gold" : isVehicle ? "dark" : "dark"} className="text-[9px] sm:text-[10px]">
                          {isProperty ? "Property" : isVehicle ? "Vehicle" : "Contact"}
                        </Badge>
                        {listing?.price && (
                          <span className="text-[10px] text-gold/70">
                            {formatCurrency(listing.price, listing.currency || "USD")}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-white/50 mt-1 line-clamp-1">{item.message}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{item.name} · {item.email}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/5">
          {selected ? (
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[700px]">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base sm:text-lg font-display font-bold text-white">Inquiry Details</h2>
                <button onClick={() => handleDelete(selected.id)}
                  className="p-1.5 sm:p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 shrink-0">
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {(selected.type === "property" || selected.type === "property-enquiry" || selected.type === "vehicle" || selected.type === "vehicle-enquiry") && selected.listing && (
                <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
                  {selected.listing.images?.[0] && (
                    <img src={selected.listing.images[0]} alt={selected.listing.title}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                  )}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-semibold text-white">{selected.listing.title}</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {(selected.type === "property" || selected.type === "property-enquiry") && (
                        <>
                          <div><span className="text-white/40">Type</span><p className="text-white capitalize">{selected.listing.type}</p></div>
                          <div><span className="text-white/40">Status</span><p className="text-white capitalize">{selected.listing.status?.replace("-", " ")}</p></div>
                          <div><span className="text-white/40">Location</span><p className="text-white">{selected.listing.location}</p></div>
                          <div><span className="text-white/40">Price</span><p className="text-gold font-semibold">{formatCurrency(selected.listing.price, selected.listing.currency || "USD")}</p></div>
                          {selected.listing.bedrooms && <div><span className="text-white/40">Bedrooms</span><p className="text-white">{selected.listing.bedrooms}</p></div>}
                          {selected.listing.bathrooms && <div><span className="text-white/40">Bathrooms</span><p className="text-white">{selected.listing.bathrooms}</p></div>}
                        </>
                      )}
                      {(selected.type === "vehicle" || selected.type === "vehicle-enquiry") && (
                        <>
                          <div><span className="text-white/40">Make</span><p className="text-white">{selected.listing.make}</p></div>
                          <div><span className="text-white/40">Model</span><p className="text-white">{selected.listing.model}</p></div>
                          <div><span className="text-white/40">Year</span><p className="text-white">{selected.listing.year}</p></div>
                          <div><span className="text-white/40">Price</span><p className="text-gold font-semibold">{formatCurrency(selected.listing.price, selected.listing.currency || "USD")}</p></div>
                          {selected.listing.mileage && <div><span className="text-white/40">Mileage</span><p className="text-white">{selected.listing.mileage.toLocaleString()} mi</p></div>}
                          {selected.listing.fuelType && <div><span className="text-white/40">Fuel</span><p className="text-white capitalize">{selected.listing.fuelType}</p></div>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Customer</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-sm font-bold text-gold shrink-0">
                    {selected.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{selected.name}</p>
                    <p className="text-xs text-white/40">{selected.email}</p>
                  </div>
                </div>
                {selected.phone && (
                  <p className="text-sm text-white/60 flex items-center gap-2">
                    <span className="text-white/30">📞</span> {selected.phone}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={selected.isRead ? "dark" : "gold"} className="text-[10px]">
                    {selected.isRead ? "Read" : "Unread"}
                  </Badge>
                  <span className="text-[10px] text-white/30">{formatRelativeTime(selected.createdAt)}</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed whitespace-pre-wrap bg-white/[0.02] rounded-xl p-3 border border-white/5">{selected.message}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <a href={`mailto:${selected.email}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-all">
                  <Mail className="w-3.5 h-3.5 shrink-0" /> Reply via Email
                </a>
                {selected.listing?.slug && (
                  <a href={`/${selected.type === "vehicle" || selected.type === "vehicle-enquiry" ? "vehicles" : "properties"}/${selected.listing.slug}`} target="_blank"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-all">
                    View Listing ↗
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-white/30">
              <MessageSquare className="w-12 h-12 mb-3" />
              <p className="text-sm">Select an inquiry to view details</p>
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
