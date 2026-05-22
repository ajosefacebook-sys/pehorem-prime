"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User, Sparkles, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/types"

const initialMessages: ChatMessage[] = [
  {
    id: "0",
    role: "assistant",
    content: "Welcome to PEHOREM PRIME. I'm your AI concierge. I can help you discover luxury properties, premium vehicles, provide investment insights, or connect you with our team. How may I assist you today?",
    timestamp: new Date(),
  },
]

const AI_RESPONSES: Record<string, string> = {
  properties: "We have an exquisite collection of luxury properties including beachfront villas in Lagos, penthouses in Ikoyi, and commercial spaces in Victoria Island. Prices range from $500,000 to $8.5 million. Would you like to see specific types?",
  investment: "Nigeria's luxury real estate market shows strong growth potential, particularly in Lagos (Ikoyi, Victoria Island, Banana Island) and Abuja. Current ROI averages 8-15% annually for prime properties.",
  vehicles: "Our premium vehicle collection features Rolls-Royce, Lamborghini, Bentley, Porsche, and more. What type of vehicle interests you?",
  list: "Listing your property or vehicle on PEHOREM PRIME is simple. Our AI-assisted listing process creates professional descriptions and optimal pricing recommendations.",
  advertise: "Our AI Advertisement Boosting system uses smart targeting to reach high-net-worth buyers. Features include sponsored listings, AI-generated ad copy, audience targeting, and campaign analytics. Campaigns start from $500/month.",
}

function ChatbotModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID() || Math.random().toString(36), role, content, timestamp: new Date() }])
  }

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    if (input.includes("property") || input.includes("real estate") || input.includes("house") || input.includes("villa") || input.includes("apartment")) return AI_RESPONSES.properties
    if (input.includes("invest") || input.includes("roi") || input.includes("market") || input.includes("growth")) return AI_RESPONSES.investment
    if (input.includes("vehicle") || input.includes("car") || input.includes("auto") || input.includes("rolls") || input.includes("lamborghini") || input.includes("bentley")) return AI_RESPONSES.vehicles
    if (input.includes("list") || input.includes("sell") || input.includes("upload")) return AI_RESPONSES.list
    if (input.includes("advertise") || input.includes("boost") || input.includes("sponsor") || input.includes("campaign")) return AI_RESPONSES.advertise
    return ""
  }

  const handleSend = async (text?: string) => {
    const message = (text || input).trim()
    if (!message) return
    addMessage("user", message)
    setInput("")
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
    const response = getAIResponse(message)
    if (response) {
      addMessage("assistant", response)
    } else {
      addMessage("assistant", "I'd be delighted to provide more detailed information. Could you please specify what you're looking for? Alternatively, you can connect with our team directly on WhatsApp for personalized assistance.")
    }
    setIsTyping(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-6 left-6 z-50 w-[360px] sm:w-[400px] h-[600px] max-h-[80vh] glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
    >
      <div className="bg-gradient-to-r from-gold-dark to-gold p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-black font-semibold text-sm">AI Concierge</p>
            <p className="text-black/60 text-xs">Always here to help</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors">
          <X className="w-4 h-4 text-black" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-100">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", msg.role === "assistant" ? "bg-gold/20" : "bg-white/10")}>
              {msg.role === "assistant" ? <Bot className="w-4 h-4 text-gold" /> : <User className="w-4 h-4 text-white/60" />}
            </div>
            <div className={cn("max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed", msg.role === "assistant" ? "glass-card border border-white/5 text-white/80" : "gold-gradient text-black")}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-gold" />
            </div>
            <div className="glass-card border border-white/5 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-dark-200 border-t border-white/5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about properties, vehicles, investments..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 transition-colors"
          />
          <button onClick={() => handleSend()} disabled={!input.trim()} className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center disabled:opacity-50 transition-all flex-shrink-0">
            <Send className="w-4 h-4 text-black" />
          </button>
        </div>
        <button
          onClick={() => window.open("https://wa.me/234800746736?text=Hello!%20I%20need%20assistance%20with%20PEHOREM%20PRIME.", "_blank")}
          className="mt-2 w-full flex items-center justify-center gap-2 text-xs text-white/40 hover:text-green-400 transition-colors py-1"
        >
          <MessageCircle className="w-3 h-3" /> Speak with a human on WhatsApp <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  )
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full shadow-xl flex items-center justify-center md:hidden",
          "bg-gradient-to-r from-gold-dark to-gold"
        )}
      >
        <Bot className="w-5 h-5 text-black" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-4 right-4 z-50 w-[360px] sm:w-[400px] h-[600px] max-h-[80vh] glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
          >
            <div className="bg-gradient-to-r from-gold-dark to-gold p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-black font-semibold text-sm">AI Concierge</p>
                  <p className="text-black/60 text-xs">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors">
                <X className="w-4 h-4 text-black" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-100">
              {initialMessages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-gold" />
                  </div>
                  <div className="glass-card border border-white/5 rounded-2xl px-4 py-3 text-sm leading-relaxed text-white/80">
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-dark-200 border-t border-white/5">
              <p className="text-white/40 text-xs text-center mb-3">Chat feature coming soon. Connect with us on WhatsApp!</p>
              <button
                onClick={() => window.open("https://wa.me/234800746736?text=Hello!%20I%20need%20assistance%20with%20PEHOREM%20PRIME.", "_blank")}
                className="w-full bg-green-500 hover:bg-green-400 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function ChatbotFAB() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex fixed bottom-6 left-6 z-40 items-center gap-2 px-4 py-3 rounded-2xl glass-card border border-white/10 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300 group"
      >
        <Bot className="w-5 h-5 text-gold" />
        <span className="text-sm text-white/70 group-hover:text-white transition-colors">AI Assistant</span>
        <Sparkles className="w-3.5 h-3.5 text-gold/60" />
      </button>

      <AnimatePresence>
        {isOpen && <ChatbotModal onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
