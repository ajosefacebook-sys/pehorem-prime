"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X } from "lucide-react"

const WHATSAPP_NUMBER = "234800746736"
const DEFAULT_MESSAGE = "Hello! I'm interested in learning more about PEHOREM PRIME luxury marketplace."

export function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState(() => ({
    x: typeof window !== "undefined" ? window.innerWidth - 100 : 0,
    y: typeof window !== "undefined" ? window.innerHeight - 100 : 0,
  }))
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`
    window.open(url, "_blank")
  }

  return (
    <div
      ref={buttonRef}
      style={{
        position: "fixed",
        left: position.x || (typeof window !== "undefined" ? window.innerWidth - 100 : 0),
        top: position.y || (typeof window !== "undefined" ? window.innerHeight - 100 : 0),
        zIndex: 9999,
      }}
      className="hidden md:block"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-80 glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">PEHOREM PRIME</p>
                  <p className="text-white/70 text-xs">Typically replies within 1 hour</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-dark-200">
              <div className="bg-dark-100 rounded-2xl p-4 mb-4 border border-white/5">
                <p className="text-white/80 text-sm leading-relaxed">
                  👋 Hello! Welcome to PEHOREM PRIME. How can we assist you with luxury properties or premium vehicles today?
                </p>
              </div>
              <button
                onClick={openWhatsApp}
                className="w-full bg-green-500 hover:bg-green-400 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Start Chat on WhatsApp
              </button>
              <p className="text-white/30 text-xs text-center mt-3">
                Our team is available 24/7
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onMouseDown={handleMouseDown}
        onClick={() => !isDragging && setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 cursor-grab active:cursor-grabbing"
        style={{
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          boxShadow: "0 4px 20px rgba(37, 211, 102, 0.3)",
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>

      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-dark animate-pulse" />
    </div>
  )
}

export function MobileWhatsApp() {
  const [isOpen, setIsOpen] = useState(false)

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`
    window.open(url, "_blank")
  }

  return (
    <div className="md:hidden fixed bottom-6 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 w-72 glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-3">
              <p className="text-white font-semibold text-sm">PEHOREM PRIME Support</p>
              <p className="text-white/70 text-xs">We reply within 1 hour</p>
            </div>
            <div className="p-3 bg-dark-200">
              <button
                onClick={openWhatsApp}
                className="w-full bg-green-500 hover:bg-green-400 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full shadow-xl flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          boxShadow: "0 4px 20px rgba(37, 211, 102, 0.3)",
        }}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <MessageCircle className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  )
}
