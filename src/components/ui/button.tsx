"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "gold" | "dark"
  size?: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-gradient-to-r from-gold-dark to-gold text-black hover:from-gold hover:to-gold-dark hover:shadow-lg hover:shadow-gold/20":
              variant === "primary",
            "border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/60":
              variant === "outline",
            "text-white/70 hover:text-white hover:bg-white/5": variant === "ghost",
            "gold-gradient text-black font-semibold hover:shadow-xl hover:shadow-gold/30 gold-glow":
              variant === "gold",
            "bg-dark-200 text-white border border-white/10 hover:bg-dark-300 hover:border-white/20":
              variant === "dark",
          },
          {
            "px-4 py-2 text-sm rounded-lg": size === "sm",
            "px-6 py-3 text-sm rounded-xl": size === "md",
            "px-8 py-4 text-base rounded-xl": size === "lg",
            "px-10 py-5 text-lg rounded-2xl": size === "xl",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
