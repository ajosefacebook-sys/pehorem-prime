"use client"

import { useEffect, useState } from "react"
import { Search, Users as UsersIcon, Trash2, Shield, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatRelativeTime } from "@/lib/admin"

interface UserData {
  id: string; name: string; email: string; phone: string | null
  role: string; isVerified: boolean; createdAt: string
  _count: { properties: number; vehicles: number; inquiries: number }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(true)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  const fetchUsers = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "15" })
    if (search) params.set("search", search)
    if (role) params.set("role", role)
    const res = await fetch(`/api/admin/users?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setUsers(data.users || [])
    setTotal(data.total || 0)
    setPages(data.pages || 1)
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [page, role])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return
    await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchUsers()
  }

  const handleRoleChange = async (id: string, newRole: string) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    })
    fetchUsers()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-white">Users</h1>
        <p className="text-white/40 text-xs sm:text-sm mt-1">Manage all registered users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 shrink-0" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/40"
            />
          </div>
          <Button type="submit" variant="outline" size="sm" className="shrink-0">Search</Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {["", "user", "agent", "dealer", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); setPage(1) }}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${role === r ? "bg-gold/20 text-gold border border-gold/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}
            >
              {r || "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/40 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">User</th>
                <th className="text-left text-xs text-white/40 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Role</th>
                <th className="text-center text-xs text-white/40 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Listings</th>
                <th className="text-center text-xs text-white/40 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Inquiries</th>
                <th className="text-left text-xs text-white/40 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Joined</th>
                <th className="text-right text-xs text-white/40 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 sm:py-12 text-white/30 text-sm">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 sm:py-12 text-white/30 text-sm">No users found</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 min-w-0 max-w-[160px] sm:max-w-[240px]">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white/50 shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-white font-medium truncate">{u.name}</p>
                        <p className="text-[10px] sm:text-xs text-white/40 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs text-white focus:outline-none focus:border-gold/40"
                    >
                      <option value="user">user</option>
                      <option value="agent">agent</option>
                      <option value="dealer">dealer</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm text-white/60 whitespace-nowrap">
                    {u._count.properties + u._count.vehicles}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm text-white/60 whitespace-nowrap">
                    {u._count.inquiries}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <span className="text-[10px] sm:text-xs text-white/40">{formatRelativeTime(u.createdAt)}</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-right">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-1.5 sm:p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page ? "bg-gold/20 text-gold" : "text-white/40 hover:text-white hover:bg-white/5"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(pages, page + 1))}
            disabled={page >= pages}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
