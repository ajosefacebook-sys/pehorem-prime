"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
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
            <h1 className="text-2xl font-display font-bold text-white">Welcome Back</h1>
            <p className="text-white/50 text-sm mt-1">Sign in to your PEHOREM PRIME account</p>
          </div>

          <form className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
            />
            <div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                icon={<Lock className="w-4 h-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-white/30 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/50 cursor-pointer">
                <input type="checkbox" className="accent-gold" />
                Remember me
              </label>
              <a href="#" className="text-gold hover:text-gold-light transition-colors">Forgot password?</a>
            </div>

            <Button variant="primary" size="lg" className="w-full">
              Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-gold hover:text-gold-light transition-colors font-medium">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
