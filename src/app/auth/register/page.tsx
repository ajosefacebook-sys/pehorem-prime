"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)

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
            <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold text-xl">P</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Create Account</h1>
            <p className="text-white/50 text-sm mt-1">Join the PEHOREM PRIME marketplace</p>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" type="text" placeholder="John" icon={<User className="w-4 h-4" />} />
              <Input label="Last Name" type="text" placeholder="Doe" />
            </div>
            <Input label="Email Address" type="email" placeholder="you@example.com" icon={<Mail className="w-4 h-4" />} />
            <Input label="Phone Number" type="tel" placeholder="+234 800 000 0000" icon={<Phone className="w-4 h-4" />} />
            <div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                icon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="flex items-start gap-3 text-xs text-white/40">
              <input type="checkbox" className="accent-gold mt-0.5" />
              <p>
                By creating an account, you agree to our{" "}
                <a href="#" className="text-gold hover:text-gold-light">Terms of Service</a> and{" "}
                <a href="#" className="text-gold hover:text-gold-light">Privacy Policy</a>
              </p>
            </div>

            <Button variant="primary" size="lg" className="w-full">
              Create Account
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
