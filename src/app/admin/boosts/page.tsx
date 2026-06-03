"use client"

import { useEffect, useState } from "react"
import { Search, ChevronDown, CheckCircle, XCircle, Clock, Ban, Plus, Minus, DollarSign, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/admin"
import { formatCurrency } from "@/lib/utils"

const STATUS_BADGE: Record<string, { label: string; variant: "gold" | "dark" | "outline" }> = {
  pending: { label: "Pending", variant: "gold" },
  approved: { label: "Approved", variant: "dark" },
  rejected: { label: "Rejected", variant: "outline" },
  suspended: { label: "Suspended", variant: "outline" },
}

const PAYMENT_BADGE: Record<string, { label: string; variant: "gold" | "dark" | "outline" }> = {
  pending: { label: "Unpaid", variant: "outline" },
  verified: { label: "Paid", variant: "gold" },
  failed: { label: "Failed", variant: "dark" },
  refunded: { label: "Refunded", variant: "dark" },
}

export default function AdminBoostsPage() {
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [updating, setUpdating] = useState<string | null>(null)
  const [extendDays, setExtendDays] = useState("30")
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  const fetchItems = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "50" })
    if (statusFilter) params.set("status", statusFilter)
    if (paymentFilter) params.set("paymentStatus", paymentFilter)
    if (search) params.set("search", search)
    const res = await fetch(`/api/admin/boosts?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setItems(data.items || [])
    setTotal(data.total || 0)
    setPages(data.pages || 1)
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [page, statusFilter, paymentFilter, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const updateBoost = async (id: string, body: Record<string, any>) => {
    setUpdating(id)
    await fetch(`/api/admin/boosts/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    setUpdating(null)
    fetchItems()
    if (selected?.id === id) {
      setSelected({ ...selected, ...body })
    }
  }

  const handleExtend = async (id: string) => {
    const days = parseInt(extendDays)
    if (isNaN(days) || days < 1) return
    const boost = items.find((i) => i.id === id)
    if (!boost) return
    const currentEnd = boost.endDate ? new Date(boost.endDate) : new Date()
    const newEnd = new Date(currentEnd.getTime() + days * 24 * 60 * 60 * 1000)
    await updateBoost(id, { endDate: newEnd.toISOString() })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this boost request?")) return
    await fetch(`/api/admin/boosts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (selected?.id === id) setSelected(null)
    fetchItems()
  }

  const actions = (boost: any) => {
    if (updating === boost.id) {
      return <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    }
    return (
      <div className="flex gap-1.5 flex-wrap">
        {boost.approvalStatus === "pending" && (
          <>
            <button onClick={() => updateBoost(boost.id, { approvalStatus: "approved" })}
              className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20" title="Approve">
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => updateBoost(boost.id, { approvalStatus: "rejected" })}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20" title="Reject">
              <XCircle className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        {boost.approvalStatus === "approved" && (
          <button onClick={() => updateBoost(boost.id, { approvalStatus: "suspended" })}
            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" title="Suspend">
            <Ban className="w-3.5 h-3.5" />
          </button>
        )}
        {boost.paymentStatus === "pending" && (
          <button onClick={() => updateBoost(boost.id, { paymentStatus: "verified" })}
            className="p-1.5 rounded-lg bg-gold/10 text-gold hover:bg-gold/20" title="Mark Payment Verified">
            <DollarSign className="w-3.5 h-3.5" />
          </button>
        )}
        <button onClick={() => handleDelete(boost.id)}
          className="p-1.5 rounded-lg bg-red-500/10 text-red-400/70 hover:bg-red-500/20" title="Remove">
          <XCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-white">Boost Listings</h1>
        <p className="text-white/40 text-xs sm:text-sm mt-1">{total} total boost requests</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All Status", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
            { label: "Suspended", value: "suspended" },
          ].map((f) => (
            <button key={f.value} onClick={() => { setStatusFilter(f.value); setPage(1) }}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === f.value ? "bg-gold/20 text-gold border border-gold/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All Payment", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Verified", value: "verified" },
            { label: "Failed", value: "failed" },
          ].map((f) => (
            <button key={f.value} onClick={() => { setPaymentFilter(f.value); setPage(1) }}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${paymentFilter === f.value ? "bg-gold/20 text-gold border border-gold/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>
              {f.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md ml-auto">
          <input
            type="text"
            placeholder="Search by listing or plan name..."
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
          <div className="divide-y divide-white/5 max-h-[700px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12 text-white/30 text-sm">Loading...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-white/30 text-sm">No boost requests found</div>
            ) : items.map((item: any) => {
              const listing = item.listing
              const thumb = listing?.images?.[0]
              const isProperty = item.listingType === "property"
              const isVehicle = item.listingType === "vehicle"
              const statusInfo = STATUS_BADGE[item.approvalStatus] || STATUS_BADGE.pending
              const payInfo = PAYMENT_BADGE[item.paymentStatus] || PAYMENT_BADGE.pending
              const isExpired = item.endDate && new Date(item.endDate) < new Date()
              return (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`p-3 sm:p-4 cursor-pointer transition-all hover:bg-white/[0.02] ${selected?.id === item.id ? "bg-gold/5 border-l-2 border-gold" : ""}`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {thumb ? (
                      <img src={thumb} alt={listing?.title}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0 border border-white/5"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        {isVehicle ? (
                          <svg className="w-5 h-5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        ) : (
                          <svg className="w-5 h-5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        )}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-white font-medium truncate">{listing?.title || item.listingId}</p>
                          {listing ? (
                            <p className="text-[10px] sm:text-xs text-white/40 truncate mt-0.5">
                              {isProperty ? `${listing.type} · ${listing.location}` : `${listing.make} ${listing.model} · ${listing.year}`}
                            </p>
                          ) : (
                            <p className="text-[10px] sm:text-xs text-white/40 truncate mt-0.5">{item.listingType}</p>
                          )}
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-white/30 whitespace-nowrap">{formatRelativeTime(item.createdAt)}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        <Badge variant={statusInfo.variant} className="text-[9px] sm:text-[10px]">{statusInfo.label}</Badge>
                        <Badge variant={payInfo.variant} className="text-[9px] sm:text-[10px]">{payInfo.label}</Badge>
                        <Badge variant={isProperty ? "gold" : "dark"} className="text-[9px] sm:text-[10px]">{isProperty ? "Property" : "Vehicle"}</Badge>
                        <span className="text-[10px] text-gold/70">{formatCurrency(item.amount, "USD")}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[10px] text-white/40">
                        <span>{item.planName}</span>
                        {item.endDate && (
                          <span className={isExpired ? "text-red-400" : ""}>
                            {isExpired ? "Expired" : `Expires ${formatRelativeTime(item.endDate)}`}
                          </span>
                        )}
                        {item.user && <span>{item.user.name}</span>}
                      </div>
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
                <h2 className="text-base sm:text-lg font-display font-bold text-white">Boost Details</h2>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={STATUS_BADGE[selected.approvalStatus]?.variant || "gold"} className="text-[10px] sm:text-xs">
                  {STATUS_BADGE[selected.approvalStatus]?.label || "Pending"}
                </Badge>
                <Badge variant={PAYMENT_BADGE[selected.paymentStatus]?.variant || "outline"} className="text-[10px] sm:text-xs">
                  {PAYMENT_BADGE[selected.paymentStatus]?.label || "Unpaid"}
                </Badge>
                <span className="text-[10px] text-white/30">{formatRelativeTime(selected.createdAt)}</span>
              </div>

              {selected.listing && (
                <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
                  {selected.listing.images?.[0] && (
                    <img src={selected.listing.images[0]} alt={selected.listing.title}
                      className="w-full h-40 sm:h-52 object-cover"
                    />
                  )}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">{selected.listing.title}</h3>
                      {selected.listing.slug && (
                        <a href={`/${selected.listingType === "property" ? "properties" : "vehicles"}/${selected.listing.slug}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-gold hover:text-gold-light p-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {selected.listingType === "property" && (
                        <>
                          <div><span className="text-white/40">Type</span><p className="text-white capitalize">{selected.listing.type}</p></div>
                          <div><span className="text-white/40">Location</span><p className="text-white">{selected.listing.location}</p></div>
                          <div><span className="text-white/40">Price</span><p className="text-gold font-semibold">{formatCurrency(selected.listing.price, selected.listing.currency || "USD")}</p></div>
                          {selected.listing.bedrooms && <div><span className="text-white/40">Bedrooms</span><p className="text-white">{selected.listing.bedrooms}</p></div>}
                          {selected.listing.bathrooms && <div><span className="text-white/40">Bathrooms</span><p className="text-white">{selected.listing.bathrooms}</p></div>}
                        </>
                      )}
                      {selected.listingType === "vehicle" && (
                        <>
                          <div><span className="text-white/40">Make</span><p className="text-white">{selected.listing.make}</p></div>
                          <div><span className="text-white/40">Model</span><p className="text-white">{selected.listing.model}</p></div>
                          <div><span className="text-white/40">Year</span><p className="text-white">{selected.listing.year}</p></div>
                          <div><span className="text-white/40">Price</span><p className="text-gold font-semibold">{formatCurrency(selected.listing.price, selected.listing.currency || "USD")}</p></div>
                          {selected.listing.mileage !== undefined && <div><span className="text-white/40">Mileage</span><p className="text-white">{selected.listing.mileage.toLocaleString()} mi</p></div>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="glass-card rounded-xl border border-white/5 p-4 space-y-3">
                <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Plan & Payment</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-white/40">Plan</span><p className="text-white font-medium">{selected.planName}</p></div>
                  <div><span className="text-white/40">Amount</span><p className="text-gold font-semibold">{formatCurrency(selected.amount, "USD")}</p></div>
                  <div><span className="text-white/40">Payment Ref</span><p className="text-white font-mono text-[10px] truncate">{selected.paymentReference || "—"}</p></div>
                  <div><span className="text-white/40">Payment Status</span><p className="text-white capitalize">{selected.paymentStatus}</p></div>
                </div>
              </div>

              {selected.user && (
                <div className="glass-card rounded-xl border border-white/5 p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">User</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-white/40">Name</span><p className="text-white">{selected.user.name}</p></div>
                    <div><span className="text-white/40">Email</span><p className="text-white">{selected.user.email}</p></div>
                    {selected.user.phone && <div><span className="text-white/40">Phone</span><p className="text-white">{selected.user.phone}</p></div>}
                  </div>
                </div>
              )}

              <div className="glass-card rounded-xl border border-white/5 p-4 space-y-3">
                <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Dates</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-white/40">Start</span><p className="text-white">{selected.startDate ? new Date(selected.startDate).toLocaleDateString() : "—"}</p></div>
                  <div><span className="text-white/40">End</span><p className="text-white">{selected.endDate ? new Date(selected.endDate).toLocaleDateString() : "—"}</p></div>
                  {selected.approvedAt && <div><span className="text-white/40">Approved At</span><p className="text-white">{new Date(selected.approvedAt).toLocaleDateString()}</p></div>}
                  {selected.approvedByUser && <div><span className="text-white/40">Approved By</span><p className="text-white">{selected.approvedByUser.name}</p></div>}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
                {selected.approvalStatus === "pending" && (
                  <>
                    <Button variant="gold" size="sm" onClick={() => updateBoost(selected.id, { approvalStatus: "approved" })}>
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Approve
                    </Button>
                    <Button variant="dark" size="sm" onClick={() => updateBoost(selected.id, { approvalStatus: "rejected" })}>
                      <XCircle className="w-3.5 h-3.5 mr-1.5" /> Reject
                    </Button>
                  </>
                )}
                {selected.approvalStatus === "approved" && (
                  <Button variant="dark" size="sm" onClick={() => updateBoost(selected.id, { approvalStatus: "suspended" })}>
                    <Ban className="w-3.5 h-3.5 mr-1.5" /> Suspend
                  </Button>
                )}
                {selected.paymentStatus === "pending" && (
                  <Button variant="gold" size="sm" onClick={() => updateBoost(selected.id, { paymentStatus: "verified" })}>
                    <DollarSign className="w-3.5 h-3.5 mr-1.5" /> Mark Paid
                  </Button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <input
                    type="number"
                    value={extendDays}
                    onChange={(e) => setExtendDays(e.target.value)}
                    className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white text-center"
                    min="1"
                  />
                  <Button variant="outline" size="sm" onClick={() => handleExtend(selected.id)}>
                    <Plus className="w-3 h-3 mr-1" /> Extend
                  </Button>
                </div>
                <Button variant="dark" size="sm" onClick={() => handleDelete(selected.id)}>
                  <XCircle className="w-3.5 h-3.5 mr-1.5" /> Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-white/30 text-sm">
              Select a boost request to view details
            </div>
          )}
        </div>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-xs bg-white/5 text-white/50 disabled:opacity-30">Previous</button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`px-3 py-1.5 rounded-lg text-xs ${p === page ? "bg-gold/20 text-gold" : "bg-white/5 text-white/50"}`}>{p}</button>
          ))}
          <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages}
            className="px-3 py-1.5 rounded-lg text-xs bg-white/5 text-white/50 disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  )
}
