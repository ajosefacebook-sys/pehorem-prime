"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, ChevronLeft, ChevronRight, Edit3, Trash2, Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/admin"

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  const fetchPosts = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "15" })
    const res = await fetch(`/api/admin/blog?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setPosts(data.posts || [])
    setTotal(data.total || 0)
    setPages(data.pages || 1)
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [page])

  const togglePublish = async (id: string, current: boolean) => {
    await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ published: !current }),
    })
    fetchPosts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return
    await fetch(`/api/admin/blog/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchPosts()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Blog Posts</h1>
          <p className="text-white/40 text-sm mt-1">{total} total posts</p>
        </div>
        <Link href="/admin/blog/new">
          <Button variant="gold" size="sm">
            <Plus className="w-4 h-4 mr-1.5" /> New Post
          </Button>
        </Link>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/40 font-medium px-4 py-3">Title</th>
                <th className="text-left text-xs text-white/40 font-medium px-4 py-3">Category</th>
                <th className="text-center text-xs text-white/40 font-medium px-4 py-3">Status</th>
                <th className="text-center text-xs text-white/40 font-medium px-4 py-3">Featured</th>
                <th className="text-left text-xs text-white/40 font-medium px-4 py-3">Date</th>
                <th className="text-right text-xs text-white/40 font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-white/30">Loading...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-white/30">No posts yet</td></tr>
              ) : posts.map((post: any) => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm text-white font-medium truncate max-w-[300px]">{post.title}</p>
                    <p className="text-xs text-white/40 truncate max-w-[300px]">{post.excerpt}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-white/50">{post.category?.name || "Uncategorized"}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={post.published ? "gold" : "dark"}>{post.published ? "Published" : "Draft"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {post.featured ? <span className="text-gold text-sm">★</span> : <span className="text-white/20 text-sm">☆</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-white/40">{formatRelativeTime(post.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => togglePublish(post.id, post.published)}
                        className={`p-1.5 rounded-lg transition-all ${post.published ? "text-emerald-400" : "text-white/30 hover:text-white"}`}>
                        {post.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <Link href={`/admin/blog/${post.id}`}
                        className="p-1.5 rounded-lg text-white/30 hover:text-gold hover:bg-gold/10 transition-all">
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => handleDelete(post.id)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
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
