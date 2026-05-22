"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Section, SectionHeader } from "@/components/ui/section"
import { cn } from "@/lib/utils"

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is PEHOREM PRIME?",
        a: "PEHOREM PRIME is the world's most sophisticated AI-powered luxury marketplace, connecting elite buyers with extraordinary properties and premium vehicles across 28+ countries.",
      },
      {
        q: "Is PEHOREM PRIME available globally?",
        a: "Yes, our platform serves clients in 28+ countries with a focus on African luxury markets, particularly Nigeria, while maintaining a global reach.",
      },
      {
        q: "How does the AI-powered platform work?",
        a: "Our AI analyzes market trends, user preferences, and listing data to provide intelligent recommendations, generate professional descriptions, optimize pricing, and power our advanced advertising system.",
      },
    ],
  },
  {
    category: "Buying & Selling",
    questions: [
      {
        q: "How do I list a property or vehicle?",
        a: "Creating a listing is simple. Register an account, navigate to your dashboard, and use our AI-assisted listing tool. The system will help generate descriptions, optimize pricing, and suggest the best media presentation.",
      },
      {
        q: "Are listings verified?",
        a: "Yes, all listings go through a verification process to ensure accuracy and quality. Our team reviews each listing before it goes live to maintain our premium standards.",
      },
      {
        q: "Can I negotiate the price?",
        a: "Price negotiations are handled directly between buyers and sellers. Our platform facilitates communication while leaving the negotiation terms to the parties involved.",
      },
    ],
  },
  {
    category: "Advertising",
    questions: [
      {
        q: "How does AI advertisement boosting work?",
        a: "Our AI advertising system uses intelligent targeting to reach high-net-worth buyers. It generates optimized ad copy, targets the right audience, and provides real-time campaign analytics.",
      },
      {
        q: "What are the advertising costs?",
        a: "We offer three tiers: Starter ($499/mo), Professional ($1,499/mo), and Enterprise ($4,999/mo). Each tier offers different levels of features, placement, and support.",
      },
      {
        q: "Can I track my campaign performance?",
        a: "Yes, all campaigns include real-time analytics showing impressions, clicks, leads, and ROI. Our AI also provides optimization recommendations.",
      },
    ],
  },
  {
    category: "Account & Security",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Get Started' on our homepage or visit the registration page. You'll need to provide your name, email, phone number, and create a password. Verification is required.",
      },
      {
        q: "Is my data secure?",
        a: "Absolutely. We employ enterprise-grade encryption, secure authentication, and strict data protection protocols. Your information is never shared without your consent.",
      },
    ],
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  return (
    <>
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="gold" className="mb-4">FAQ</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight max-w-4xl mx-auto">
              Frequently Asked{" "}
              <span className="text-gradient">Questions</span>
            </h1>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              Everything you need to know about PEHOREM PRIME marketplace
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto space-y-8">
          {faqs.map((category) => (
            <div key={category.category}>
              <h2 className="text-xl font-display font-semibold text-white mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, i) => {
                  const id = `${category.category}-${i}`
                  return (
                    <div
                      key={id}
                      className="glass-card rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => setOpenIndex(openIndex === id ? null : id)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="text-white font-medium text-sm sm:text-base pr-4">{faq.q}</span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-gold flex-shrink-0 transition-transform duration-300",
                            openIndex === id && "rotate-180"
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {openIndex === id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-5 pb-5">
                              <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
