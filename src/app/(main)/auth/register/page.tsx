"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, User, Phone, ArrowRight, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", agree: false })

  useEffect(() => {
    const ref = searchParams.get("ref")
    if (ref) {
      setReferralCode(ref)
      localStorage.setItem("referralCode", ref)
    } else {
      const stored = localStorage.getItem("referralCode")
      if (stored) setReferralCode(stored)
    }
  }, [searchParams])

  const update = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          password: form.password,
          phone: form.phone,
          referralCode: referralCode || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Registration failed")
        return
      }

      localStorage.removeItem("referralCode")
      router.push("/auth/login?registered=true")
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10">
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="PEHOREM PRIME"
              className="h-12 w-auto object-contain mx-auto mb-4"
            />
            <h1 className="text-2xl font-display font-bold text-white">Create Account</h1>
            <p className="text-white/50 text-sm mt-1">Join the PEHOREM PRIME marketplace</p>
          </div>

          {referralCode && (
            <div className="flex items-center gap-2 bg-gold/5 border border-gold/20 rounded-xl px-4 py-3 mb-6">
              <Gift className="w-4 h-4 text-gold flex-shrink-0" />
              <p className="text-gold text-xs">Referred by affiliate code: <strong>{referralCode}</strong></p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" type="text" placeholder="John" icon={<User className="w-4 h-4" />} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
              <Input label="Last Name" type="text" placeholder="Doe" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
            </div>
            <Input label="Email Address" type="email" placeholder="you@example.com" icon={<Mail className="w-4 h-4" />} value={form.email} onChange={(e) => update("email", e.target.value)} required />
            <Input label="Phone Number" type="tel" placeholder="+234 800 000 0000" icon={<Phone className="w-4 h-4" />} value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                icon={<Lock className="w-4 h-4" />}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div className="flex items-start gap-3 text-xs text-white/40">
              <input type="checkbox" className="accent-gold mt-0.5" checked={form.agree} onChange={(e) => update("agree", e.target.checked)} />
              <p>
                By creating an account, you agree to our{" "}
                <a href="#" className="text-gold hover:text-gold-light">Terms of Service</a> and{" "}
                <a href="#" className="text-gold hover:text-gold-light">Privacy Policy</a>
              </p>
            </div>

            <Button variant="primary" size="lg" className="w-full" disabled={loading || !form.agree}>
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-gold hover:text-gold-light transition-colors font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" /></div>}>
      <RegisterForm />
    </Suspense>
  )
}
