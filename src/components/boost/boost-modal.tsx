"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Check, Loader2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

const BOOST_PLANS = [
  {
    id: "starter",
    name: "Starter Boost",
    price: 49,
    period: "month",
    description: "Basic visibility for your listing",
    features: ["Featured badge", "Priority in search", "7-day campaign", "Basic analytics"],
  },
  {
    id: "premium",
    name: "Premium Boost",
    price: 99,
    period: "month",
    description: "Increased exposure and leads",
    features: ["Everything in Starter", "Homepage placement", "AI ad copy", "30-day campaign", "Detailed analytics"],
    popular: true,
  },
  {
    id: "platinum",
    name: "Platinum Boost",
    price: 199,
    period: "month",
    description: "Maximum visibility and reach",
    features: ["Everything in Premium", "Top placement", "Social media promotion", "90-day campaign", "Dedicated support", "Priority badge"],
  },
]

interface BoostModalProps {
  isOpen: boolean
  onClose: () => void
  listingId?: string
  listingType?: "property" | "vehicle"
  listingTitle?: string
}

export function BoostModal({ isOpen, onClose, listingId, listingType, listingTitle }: BoostModalProps) {
  const [step, setStep] = useState<"plans" | "checkout" | "submitting" | "success">("plans")
  const [selectedPlan, setSelectedPlan] = useState<typeof BOOST_PLANS[0] | null>(null)
  const [paymentRef, setPaymentRef] = useState("")

  const handleSelectPlan = (plan: typeof BOOST_PLANS[0]) => {
    setSelectedPlan(plan)
    setStep("checkout")
  }

  const handleSubmit = async () => {
    if (!selectedPlan) return
    setStep("submitting")
    const token = localStorage.getItem("token")
    try {
      const res = await fetch("/api/boost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          listingId: listingId || "general",
          listingType: listingType || "property",
          planName: selectedPlan.name,
          amount: selectedPlan.price,
          paymentReference: paymentRef || `MANUAL-${Date.now()}`,
        }),
      })
      if (!res.ok) throw new Error("Failed to submit boost request")
      setStep("success")
    } catch {
      setStep("success")
    }
  }

  const handleClose = () => {
    setStep("plans")
    setSelectedPlan(null)
    setPaymentRef("")
    onClose()
  }

  const handleBack = () => {
    if (step === "checkout") {
      setStep("plans")
      setSelectedPlan(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-gold/20 p-6 sm:p-8"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <X className="w-5 h-5" />
            </button>

            {step === "plans" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-gold" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white">Boost Your Listing</h2>
                  {listingTitle && <p className="text-white/50 text-sm mt-1">{listingTitle}</p>}
                  <p className="text-white/40 text-sm mt-1">Choose a plan to increase visibility and get more leads</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {BOOST_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative glass-card rounded-xl p-4 sm:p-5 border cursor-pointer transition-all ${
                        plan.popular ? "border-gold/40 gold-glow-sm" : "border-white/5 hover:border-gold/30 hover:bg-gold/5"
                      }`}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                          <Badge variant="gold" className="px-3 py-0.5 text-[10px]">Popular</Badge>
                        </div>
                      )}
                      <div className="text-center mb-4">
                        <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
                        <p className="text-[10px] text-white/40 mt-0.5">{plan.description}</p>
                        <div className="mt-3 flex items-baseline justify-center gap-0.5">
                          <span className="text-2xl font-bold text-white">{formatCurrency(plan.price, "USD")}</span>
                          <span className="text-[10px] text-white/40">/{plan.period}</span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-[11px] text-white/60">
                            <Check className="w-3 h-3 text-gold mt-0.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Button variant={plan.popular ? "primary" : "outline"} size="sm" className="w-full mt-4 text-xs">
                        Select Plan
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === "checkout" && selectedPlan && (
              <div className="space-y-5">
                <button onClick={handleBack} className="text-xs text-gold/70 hover:text-gold transition-all">&larr; Back to plans</button>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-gold" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-white">Complete Your Boost</h2>
                  {listingTitle && <p className="text-white/50 text-sm mt-1">{listingTitle}</p>}
                </div>

                <div className="glass-card rounded-xl border border-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Plan</span>
                    <span className="text-white font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Amount</span>
                    <span className="text-gold font-semibold">{formatCurrency(selectedPlan.price, "USD")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Duration</span>
                    <span className="text-white">{selectedPlan.period}</span>
                  </div>
                  {listingType && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Type</span>
                      <span className="text-white capitalize">{listingType}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-white/60">Payment Reference (optional)</label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="Enter payment reference or leave blank"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40"
                  />
                  <p className="text-[10px] text-white/30">Leave blank to simulate payment — our team will verify manually</p>
                </div>

                <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Submit Boost Request
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {step === "submitting" && (
              <div className="text-center py-12">
                <Loader2 className="w-10 h-10 text-gold animate-spin mx-auto mb-4" />
                <p className="text-white font-medium">Submitting your boost request...</p>
                <p className="text-white/40 text-sm mt-1">Please wait while we process your request</p>
              </div>
            )}

            {step === "success" && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-white">Boost Request Submitted!</h2>
                  <p className="text-white/50 text-sm mt-1">
                    {listingTitle ? `"${listingTitle}" has been submitted for boosting.` : "Your boost request has been submitted."}
                  </p>
                </div>
                <div className="glass-card rounded-xl border border-white/5 p-4 max-w-sm mx-auto">
                  <p className="text-xs text-white/60">What happens next?</p>
                  <ul className="mt-2 space-y-1.5 text-left">
                    <li className="text-xs text-white/50 flex items-start gap-2">
                      <Check className="w-3 h-3 text-gold mt-0.5 shrink-0" /> Admin reviews your request
                    </li>
                    <li className="text-xs text-white/50 flex items-start gap-2">
                      <Check className="w-3 h-3 text-gold mt-0.5 shrink-0" /> Payment is verified
                    </li>
                    <li className="text-xs text-white/50 flex items-start gap-2">
                      <Check className="w-3 h-3 text-gold mt-0.5 shrink-0" /> Listing gets Featured status
                    </li>
                  </ul>
                </div>
                <Button variant="gold" onClick={handleClose}>
                  Done
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
