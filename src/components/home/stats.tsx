"use client"

import { motion } from "framer-motion"
import { Section } from "@/components/ui/section"
import { stats } from "@/lib/data"
import { TrendingUp, Users, Building2, Globe } from "lucide-react"

const icons = [TrendingUp, Users, Building2, Globe]

export function StatsSection() {
  return (
    <Section variant="dark" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />

      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {stats.map((stat, i) => {
          const Icon = icons[i]
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gold/10 border border-gold/30 mb-4 gold-glow-sm">
                <Icon className="w-6 h-6 text-gold" />
              </div>
              <p className="text-3xl sm:text-4xl font-display font-bold text-gold mb-1">{stat.value}</p>
              <p className="text-sm text-white/50 uppercase tracking-[0.1em]">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
