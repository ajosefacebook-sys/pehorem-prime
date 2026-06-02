"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, ArrowRight, Building2, Car, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    title: "Luxury Properties & Premium Vehicles",
    subtitle: "Where Smart Investment Meets Luxury Living",
  },
  {
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    title: "AI-Powered Global Marketplace",
    subtitle: "Discover Extraordinary Properties and Premium Automobiles",
  },
  {
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    title: "Curated Excellence Worldwide",
    subtitle: "Handpicked Luxury. Intelligent Technology. Global Reach.",
  },
  {
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e",
    title: "Where Wealth Meets Vision",
    subtitle: "World-Class Properties and Exclusive Automobiles",
  },
  {
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
    title: "Invest in Extraordinary Living",
    subtitle: "Premium Real Estate. Luxury Vehicles. Elite Portfolio.",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchFocused, setSearchFocused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 7000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [nextSlide])

  return (
    <section className="relative h-screen min-h-[700px] max-h-[1080px] overflow-hidden bg-black">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === currentSlide ? 1 : 0,
            transition: "opacity 2s ease-in-out",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: `scale(${i === currentSlide ? 1 : 1.08})`,
              transition: "transform 10s ease-out",
            }}
          />
        </div>
      ))}

      <div className="absolute inset-0 z-[1] bg-black/65" />

      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-br from-gold/[0.04] via-transparent to-transparent" />

      <div className="absolute top-0 left-0 right-0 z-[2] h-32 bg-gradient-to-b from-black/60 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-gold/30 mb-6 sm:mb-8">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
              AI-Powered Luxury Marketplace
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-[1.1] tracking-wide">
            {slides[currentSlide].title.split("&").map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="text-gold block sm:inline"> &</span>}
                {part}
              </span>
            ))}
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/80 max-w-2xl font-light leading-relaxed">
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
              className={`flex items-center bg-black/60 backdrop-blur-2xl border rounded-2xl transition-all duration-300 ${
                searchFocused
                  ? "border-gold/60 ring-2 ring-gold/30 shadow-lg shadow-gold/15"
                  : "border-gold/20"
              }`}
            >
              <Search className="ml-5 w-5 h-5 text-gold/60 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search luxury properties, vehicles, locations..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent px-4 py-4 sm:py-5 text-white placeholder:text-white/40 focus:outline-none text-sm sm:text-base"
              />
              <div className="hidden sm:flex items-center gap-2 pr-3">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/10 text-gold/80 text-xs border border-gold/20">
                  <Building2 className="w-3.5 h-3.5" />
                  Properties
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/10 text-gold/80 text-xs border border-gold/20">
                  <Car className="w-3.5 h-3.5" />
                  Vehicles
                </div>
              </div>
              <button className="m-2 gold-gradient text-black font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm hover:shadow-lg hover:shadow-gold/30 transition-all">
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

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-700 ${
              i === currentSlide ? "w-12 gold-gradient" : "w-3 bg-white/30 hover:bg-gold/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
