"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar, AdminMobileHeader } from "./sidebar"
import { cn } from "@/lib/utils"

const publicPaths = ["/admin/login", "/admin/login/"]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("token")
    const isPublic = publicPaths.some((p) => pathname.startsWith(p))
    if (!token && !isPublic) {
      router.replace("/admin/login")
    }
  }, [pathname, router])

  if (!mounted) return null

  const isPublic = publicPaths.some((p) => pathname.startsWith(p))
  if (isPublic) return <>{children}</>

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      <AdminMobileHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full">
            <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <main className={cn("p-3 sm:p-5 lg:p-8", "pt-16 lg:pt-8")}>
          {children}
        </main>
      </div>
    </div>
  )
}
