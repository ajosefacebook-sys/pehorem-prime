import { cn } from "@/lib/utils"

interface CardProps {
  className?: string
  children: React.ReactNode
  hover?: boolean
}

export function Card({ className, children, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl overflow-hidden transition-all duration-500",
        hover && "hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardImage({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
    </div>
  )
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("p-5", className)}>
      {children}
    </div>
  )
}
