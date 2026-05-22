import { cn } from "@/lib/utils"

interface BadgeProps {
  variant?: "gold" | "dark" | "outline"
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = "dark", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-xs font-medium rounded-full",
        {
          "gold-gradient text-black": variant === "gold",
          "bg-white/5 text-white/80 border border-white/10": variant === "dark",
          "border border-gold/30 text-gold": variant === "outline",
        },
        className
      )}
    >
      {children}
    </span>
  )
}
