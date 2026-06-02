"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save } from "lucide-react"

export default function NewBlogPost() {
  const router = useRouter()
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""
  const [categories, setCategories] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", coverImage: "",
    author: "Admin", published: false, featured: false,
    categoryId: "", tags: "", metaTitle: "", metaDesc: "", keywords: "",
  })

  useEffect(() => {
    fetch("/api/admin/blog", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const body = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) }
    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (res.ok) router.push("/admin/blog")
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-white">New Blog Post</h1>
          <p className="text-white/40 text-sm mt-1">Create a new blog article</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl border border-white/5 p-6 space-y-5">
        <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <Input label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <div>
          <label className="block text-sm text-white/70 mb-1.5">Content (Markdown supported)</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={12} required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/40 font-mono" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Cover Image URL" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." />
          <Input label="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/70 mb-1.5">Category</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold/40">
              <option value="">Uncategorized</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="tag1, tag2" />
        </div>
        <hr className="border-white/5" />
        <p className="text-xs text-white/40 font-medium uppercase tracking-wider">SEO Settings</p>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Meta Title" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
          <Input label="Meta Description" value={form.metaDesc} onChange={(e) => setForm({ ...form, metaDesc: e.target.value })} />
        </div>
        <Input label="Keywords" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="accent-gold" />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="accent-gold" />
            Featured
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="gold" disabled={saving}>
            <Save className="w-4 h-4 mr-1.5" /> {saving ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </form>
    </div>
  )
}
