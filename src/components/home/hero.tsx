"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, ArrowRight, Building2, Car, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
    title: "Luxury Properties & Premium Vehicles",
    subtitle: "Where Smart Investment Meets Luxury Living",
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
    title: "AI-Powered Global Marketplace",
    subtitle: "Discover Extraordinary Properties and Premium Automobiles",
  },
  {
    image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=1920&q=80",
    title: "Invest in Excellence",
    subtitle: "Curated Luxury. Intelligent Technology. Global Reach.",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchFocused, setSearchFocused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <section className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-1000"
          style={{
            opacity: i === currentSlide ? 1 : 0,
            transform: `scale(${i === currentSlide ? 1 : 1.05})`,
            transition: "opacity 1.5s ease, transform 8s ease",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-xs uppercase tracking-[0.15em] text-white/70">
              AI-Powered Luxury Marketplace
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-white leading-[1.1] tracking-tight">
            {slides[currentSlide].title.split("&").map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="text-gold block sm:inline"> &</span>}
                {part}
              </span>
            ))}
          </h1>

          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-white/60 max-w-2xl font-light leading-relaxed">
            {slides[currentSlide].subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-10 max-w-3xl"
        >
          <div className="relative">
            <div
              className={`flex items-center bg-white/5 backdrop-blur-2xl border rounded-2xl transition-all duration-300 ${
                searchFocused
                  ? "border-gold/50 ring-2 ring-gold/20 shadow-lg shadow-gold/10"
                  : "border-white/10"
              }`}
            >
              <Search className="ml-5 w-5 h-5 text-white/40 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search luxury properties, vehicles, locations..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent px-4 py-4 sm:py-5 text-white placeholder:text-white/30 focus:outline-none text-sm sm:text-base"
              />
              <div className="hidden sm:flex items-center gap-2 pr-3">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-white/60 text-xs">
                  <Building2 className="w-3.5 h-3.5" />
                  Properties
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-white/60 text-xs">
                  <Car className="w-3.5 h-3.5" />
                  Vehicles
                </div>
              </div>
              <button className="m-2 gold-gradient text-black font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
                Search
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4"
        >
          <Link href="/properties">
            <Button variant="primary" size="lg">
              <Building2 className="w-4 h-4 mr-2" />
              Explore Properties
            </Button>
          </Link>
          <Link href="/vehicles">
            <Button variant="outline" size="lg">
              <Car className="w-4 h-4 mr-2" />
              Explore Vehicles
            </Button>
          </Link>
          <Link href="/advertise">
            <Button variant="ghost" size="lg">
              Boost My Ad
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === currentSlide ? "w-12 gold-gradient" : "w-4 bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
