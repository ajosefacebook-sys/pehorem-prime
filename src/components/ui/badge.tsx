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
          "gold-gradient text-black font-semibold": variant === "gold",
          "bg-gold/10 text-gold border border-gold/30": variant === "dark",
          "border border-gold/50 text-gold bg-gold/5": variant === "outline",
        },
        className
      )}
    >
      {children}
    </span>
  )
}
