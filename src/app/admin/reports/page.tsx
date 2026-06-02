"use client"

import { useEffect, useState } from "react"
import { BarChart3, Building2, Car, Users, MessageSquare } from "lucide-react"
import { formatRelativeTime } from "@/lib/admin"

export default function AdminReportsPage() {
  const [data, setData] = useState<any>(null)
  const [period, setPeriod] = useState("month")
  const [loading, setLoading] = useState(true)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/reports?period=${period}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [period])

  if (loading) return <div className="text-center py-12 text-white/30">Loading...</div>

  const statCards = [
    { label: "Properties", value: data?.counts?.properties || 0, icon: Building2, color: "from-emerald-500/20" },
    { label: "Vehicles", value: data?.counts?.vehicles || 0, icon: Car, color: "from-amber-500/20" },
    { label: "Users", value: data?.counts?.users || 0, icon: Users, color: "from-violet-500/20" },
    { label: "Inquiries", value: data?.counts?.inquiries || 0, icon: MessageSquare, color: "from-rose-500/20" },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white">Reports</h1>
          <p className="text-white/40 text-xs sm:text-sm mt-1">Analytics and statistics for {period}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["week", "month", "year"].map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${period === p ? "bg-gold/20 text-gold border border-gold/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card rounded-2xl p-3 sm:p-4 border border-white/5 relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} to-transparent opacity-30`} />
              <div className="relative">
                <Icon className="w-4 h-4 text-gold mb-1.5 sm:mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
                <p className="text-[11px] sm:text-xs text-white/40">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="glass-card rounded-2xl border border-white/5 p-4 sm:p-5">
          <h2 className="text-sm sm:text-base font-display font-semibold text-white mb-3 sm:mb-4">Properties by Type</h2>
          <div className="space-y-2.5 sm:space-y-3">
            {data?.propertiesByType?.map((item: any) => (
              <div key={item.type} className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-white/60 capitalize min-w-0 truncate">{item.type}</span>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="w-20 sm:w-32 h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${(item._count / Math.max(...data.propertiesByType.map((p: any) => p._count))) * 100}%` }} />
                  </div>
                  <span className="text-xs sm:text-sm text-white font-medium w-6 sm:w-8 text-right">{item._count}</span>
                </div>
              </div>
            ))}
            {(!data?.propertiesByType || data.propertiesByType.length === 0) && (
              <p className="text-white/30 text-xs sm:text-sm text-center py-3 sm:py-4">No data</p>
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/5 p-4 sm:p-5">
          <h2 className="text-sm sm:text-base font-display font-semibold text-white mb-3 sm:mb-4">Top Vehicle Makes</h2>
          <div className="space-y-2.5 sm:space-y-3">
            {data?.vehiclesByMake?.map((item: any) => (
              <div key={item.make} className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-white/60 min-w-0 truncate">{item.make}</span>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="w-20 sm:w-32 h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${(item._count / Math.max(...data.vehiclesByMake.map((p: any) => p._count))) * 100}%` }} />
                  </div>
                  <span className="text-xs sm:text-sm text-white font-medium w-6 sm:w-8 text-right">{item._count}</span>
                </div>
              </div>
            ))}
            {(!data?.vehiclesByMake || data.vehiclesByMake.length === 0) && (
              <p className="text-white/30 text-xs sm:text-sm text-center py-3 sm:py-4">No data</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 p-4 sm:p-5">
        <h2 className="text-sm sm:text-base font-display font-semibold text-white mb-3 sm:mb-4">Users by Role</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {data?.usersByRole?.map((item: any) => (
            <div key={item.role} className="text-center p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-lg sm:text-2xl font-bold text-white">{item._count}</p>
              <p className="text-[10px] sm:text-xs text-white/50 capitalize mt-0.5 sm:mt-1">{item.role}s</p>
            </div>
          ))}
          {(!data?.usersByRole || data.usersByRole.length === 0) && (
            <p className="text-white/30 text-xs sm:text-sm text-center py-3 sm:py-4 col-span-full">No data</p>
          )}
        </div>
      </div>
    </div>
  )
}
