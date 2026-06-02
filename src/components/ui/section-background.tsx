"use client"

import { useEffect, useState, useRef, useCallback } from "react"

interface SectionBackgroundProps {
  slides: string[]
}

export function SectionBackground({ slides }: SectionBackgroundProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 12000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [nextSlide])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === currentSlide ? 0.15 : 0,
            transition: "opacity 3s ease-in-out",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide})` }}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/30 to-dark" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/20 to-transparent" />
    </div>
  )
}
