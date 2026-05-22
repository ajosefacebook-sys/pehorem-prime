"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Quote, Star } from "lucide-react"
import { Section, SectionHeader } from "@/components/ui/section"
import { testimonials } from "@/lib/data"

export function TestimonialsSection() {
  return (
    <Section variant="glass">
      <SectionHeader
        title="What Our Clients Say"
        subtitle="Trusted by elite investors, collectors, and luxury home buyers worldwide"
        gold
      />

      <div className="grid md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6 sm:p-8 border border-white/5 hover:border-gold/20 transition-all duration-500"
          >
            <Quote className="w-8 h-8 text-gold/30 mb-4" />
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
              &ldquo;{testimonial.content}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                <p className="text-white/40 text-xs">{testimonial.role}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
