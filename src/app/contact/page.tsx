"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, MessageCircle, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/ui/section"

export default function ContactPage() {
  return (
    <>
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="gold" className="mb-4">Get In Touch</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight max-w-4xl mx-auto">
              Let&apos;s Discuss Your{" "}
              <span className="text-gradient">Luxury Journey</span>
            </h1>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              Our team of luxury market specialists is ready to assist you with personalized service.
            </p>
          </motion.div>
        </div>
      </section>

      <Section variant="glass">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-display font-bold text-white mb-6">Contact Information</h2>
            <div className="space-y-5">
              {[
                { icon: MapPin, label: "Address", value: "Victoria Island, Lagos, Nigeria" },
                { icon: Phone, label: "Phone", value: "+234 800 PEHOREM" },
                { icon: Mail, label: "Email", value: "hello@pehoremprime.com" },
                { icon: Clock, label: "Working Hours", value: "Mon - Sat: 8:00 AM - 6:00 PM" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 glass-card rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <p className="text-white font-semibold">Prefer WhatsApp?</p>
              </div>
              <p className="text-white/50 text-sm mb-4">Our team responds within 1 hour on WhatsApp</p>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => window.open("https://wa.me/234800746736?text=Hello!%20I%20have%20a%20question%20about%20PEHOREM%20PRIME.", "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat on WhatsApp
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-display font-bold text-white mb-6">Send a Message</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" type="text" placeholder="John" />
                  <Input label="Last Name" type="text" placeholder="Doe" />
                </div>
                <Input label="Email Address" type="email" placeholder="you@example.com" />
                <Input label="Phone Number" type="tel" placeholder="+234 800 000 0000" />
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Message</label>
                  <textarea
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all resize-none"
                  />
                </div>
                <Button variant="primary" size="lg" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  )
}
