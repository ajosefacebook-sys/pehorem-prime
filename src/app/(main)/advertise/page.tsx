"use client"

import { motion } from "framer-motion"
import { Sparkles, Target, TrendingUp, Globe, Check, ChevronRight, Eye, MousePointerClick } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Section, SectionHeader } from "@/components/ui/section"

const features = [
  {
    icon: Sparkles,
    title: "AI-Generated Ad Copy",
    description: "Our AI creates compelling ad copy and captions optimized for luxury audiences.",
  },
  {
    icon: Target,
    title: "Smart Audience Targeting",
    description: "Reach high-net-worth individuals based on location, interests, and behavior.",
  },
  {
    icon: TrendingUp,
    title: "Campaign Analytics",
    description: "Real-time performance tracking with detailed insights and recommendations.",
  },
  {
    icon: Eye,
    title: "Premium Placement",
    description: "Get featured placement on homepage, category pages, and search results.",
  },
  {
    icon: MousePointerClick,
    title: "Click & Lead Tracking",
    description: "Track every interaction and capture quality leads automatically.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Showcase your listings to an international audience of luxury buyers.",
  },
]

const plans = [
  {
    name: "Starter",
    price: "499",
    period: "month",
    description: "Perfect for individual sellers",
    features: ["1 featured listing", "AI-generated captions", "Basic analytics", "7-day campaign", "Standard support"],
  },
  {
    name: "Professional",
    price: "1,499",
    period: "month",
    description: "Ideal for agents and dealers",
    features: [
      "5 featured listings",
      "AI ad copy generation",
      "Advanced analytics",
      "Audience targeting",
      "Homepage placement",
      "Priority support",
      "30-day campaign",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "4,999",
    period: "month",
    description: "For agencies and portfolios",
    features: [
      "Unlimited listings",
      "Full AI suite",
      "Real-time analytics",
      "Premium targeting",
      "Homepage featured",
      "Dedicated account manager",
      "90-day campaign",
      "API access",
    ],
  },
]

export default function AdvertisePage() {
  return (
    <>
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="gold" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Advertising
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight max-w-4xl mx-auto">
              Boost Your Listings with{" "}
              <span className="text-gradient">AI-Powered</span> Advertising
            </h1>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              Reach premium buyers with intelligent ad targeting, AI-generated content, and real-time campaign analytics.
            </p>
          </motion.div>
        </div>
      </section>

      <Section variant="glass">
        <SectionHeader
          title="Why Boost Your Listings?"
          subtitle="Our AI advertising system ensures your premium listings get the visibility they deserve"
          gold
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card rounded-2xl p-6 border border-white/5 hover:border-gold/20 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </Section>

      <Section variant="default">
        <SectionHeader
          title="Choose Your Plan"
          subtitle="Flexible pricing for every scale of luxury marketplace presence"
          gold
        />

        <div className="grid md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative glass-card rounded-2xl p-6 sm:p-8 border transition-all duration-500 ${
                plan.popular ? "border-gold/40 gold-glow-sm" : "border-white/5 hover:border-gold/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="gold" className="px-4 py-1">Most Popular</Badge>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-display font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-white/40 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/40 text-sm">/{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white/60">
                    <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant={plan.popular ? "primary" : "outline"} size="lg" className="w-full">
                Get Started
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  )
}
