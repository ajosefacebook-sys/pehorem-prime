"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Gift, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AffiliateLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [statusMsg, setStatusMsg] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("affiliate_token")
    if (token) router.push("/affiliate/dashboard")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setStatusMsg("")
    setLoading(true)

    try {
      const res = await fetch("/api/v1/affiliate/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        if (data.status === "pending" || data.status === "rejected" || data.status === "suspended") {
          setStatusMsg(data.error)
        } else {
          setError(data.error || "Login failed")
        }
        return
      }

      localStorage.setItem("affiliate_token", data.token)
      localStorage.setItem("affiliate", JSON.stringify(data.affiliate))
      router.push("/affiliate/dashboard")
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-[#1a1f2e] rounded-3xl p-8 sm:p-10 border border-[#2a2f3e]">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gold to-gold-light flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Affiliate Login</h1>
            <p className="text-white/50 text-sm mt-1">Sign in to your affiliate dashboard</p>
          </div>

          {statusMsg && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
              <p className="text-yellow-400 text-sm">{statusMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white/60 text-xs mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <Button variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-white/40 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/affiliate/register" className="text-gold hover:text-gold-light transition-colors font-medium">
                Apply Now
              </Link>
            </p>
            <p className="text-white/30 text-xs">
              <Link href="/" className="hover:text-gold transition-colors">Back to Main Site</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
