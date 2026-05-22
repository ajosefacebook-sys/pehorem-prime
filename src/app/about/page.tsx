"use client"

import { motion } from "framer-motion"
import { Sparkles, Globe, Shield, Zap, Users, Building2, Car, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Section, SectionHeader } from "@/components/ui/section"
import { stats } from "@/lib/data"

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "We curate only the finest properties and vehicles, ensuring every listing meets our exacting standards of luxury.",
  },
  {
    icon: Shield,
    title: "Trust",
    description: "Every listing is verified. Every transaction is secure. Our reputation is built on transparency and integrity.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "AI-powered technology transforms how luxury assets are discovered, evaluated, and acquired.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connecting premium sellers with discerning buyers across 28+ countries worldwide.",
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="gold" className="mb-4">About Us</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight max-w-4xl mx-auto">
              Redefining{" "}
              <span className="text-gradient">Luxury Marketplace</span> Technology
            </h1>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              PEHOREM PRIME is the world&apos;s most sophisticated AI-powered marketplace, connecting elite buyers with extraordinary properties and premium vehicles.
            </p>
          </motion.div>
        </div>
      </section>

      <Section variant="glass">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Badge variant="gold" className="mb-4">Our Mission</Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">
              Transforming How The World Buys & Sells Luxury
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              PEHOREM PRIME was founded with a singular vision: to create the most intelligent, elegant, and trustworthy marketplace for luxury assets. We combine cutting-edge artificial intelligence with deep expertise in real estate and automotive markets.
            </p>
            <p className="text-white/60 leading-relaxed">
              Our platform serves discerning clients across 28 countries, offering curated selections of premium properties and vehicles, all powered by AI that understands the nuances of luxury markets.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-80 sm:h-96 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 gold-gradient opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-3xl">P</span>
                </div>
                <p className="text-white font-display text-2xl font-bold">PEHOREM PRIME</p>
                <p className="text-gold text-sm">Since 2024</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section variant="default">
        <SectionHeader title="Our Values" subtitle="The principles that guide every interaction on our platform" gold />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {values.map((value, i) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 border border-white/5 hover:border-gold/20 transition-all"
              >
                <Icon className="w-10 h-10 text-gold mb-4" />
                <h3 className="text-white font-semibold mb-2">{value.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            )
          })}
        </div>
      </Section>
    </>
  )
}
