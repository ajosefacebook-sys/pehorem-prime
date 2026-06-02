"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Gift, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AffiliateRegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessAddress: "",
    companyRegNumber: "",
    tin: "",
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
    promotionMethod: "",
    agreeTerms: false,
  })

  const update = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/v1/affiliate/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Registration failed")
        return
      }
      setSubmitted(true)
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-4">Application Submitted!</h1>
          <p className="text-white/50 mb-8">We will review your application and get back to you within 48 hours.</p>
          <Link href="/affiliate/login">
            <Button variant="primary">Go to Login</Button>
          </Link>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-[#0f1117] flex items-center justify-center py-20 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="bg-[#1a1f2e] rounded-3xl p-8 sm:p-10 border border-[#2a2f3e]">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gold to-gold-light flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Become an Affiliate</h1>
            <p className="text-white/50 text-sm mt-1">Earn up to 15% commission on every referral</p>
          </div>

          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? "bg-gold" : "bg-white/10"}`} />
            ))}
          </div>

          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1 block">First Name *</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Last Name *</label>
                  <input
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1 block">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                  required
                />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1 block">Phone Number *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Password *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Confirm Password *</label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                    required
                  />
                </div>
              </div>
              <Button variant="primary" size="lg" className="w-full mt-4" onClick={() => setStep(2)}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Business Information</h2>
              <div>
                <label className="text-white/60 text-xs mb-1 block">Business Name *</label>
                <input
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                  required
                />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1 block">Business Address *</label>
                <input
                  value={form.businessAddress}
                  onChange={(e) => update("businessAddress", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Company Registration Number *</label>
                  <input
                    value={form.companyRegNumber}
                    onChange={(e) => update("companyRegNumber", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">TIN (Tax ID) *</label>
                  <input
                    value={form.tin}
                    onChange={(e) => update("tin", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="dark" size="lg" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="primary" size="lg" className="flex-1" onClick={() => setStep(3)}>
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Banking & Promotion</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Bank Name *</label>
                  <input
                    value={form.bankName}
                    onChange={(e) => update("bankName", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Account Number *</label>
                  <input
                    value={form.bankAccountNumber}
                    onChange={(e) => update("bankAccountNumber", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1 block">Account Name *</label>
                <input
                  value={form.bankAccountName}
                  onChange={(e) => update("bankAccountName", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
                  required
                />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1 block">How do you plan to promote Pehorem? *</label>
                <textarea
                  value={form.promotionMethod}
                  onChange={(e) => update("promotionMethod", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 min-h-[100px]"
                  required
                />
              </div>
              <label className="flex items-start gap-3 cursor-pointer mt-4">
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={(e) => update("agreeTerms", e.target.checked)}
                  className="accent-gold mt-1"
                />
                <span className="text-white/50 text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-gold hover:text-gold-light">Terms & Conditions</a> and{" "}
                  <a href="#" className="text-gold hover:text-gold-light">Commission Policy</a>
                </span>
              </label>
              <div className="flex gap-3 mt-6">
                <Button variant="dark" size="lg" className="flex-1" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={loading || !form.agreeTerms}
                  onClick={handleSubmit}
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              Already have an account?{" "}
              <Link href="/affiliate/login" className="text-gold hover:text-gold-light transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
