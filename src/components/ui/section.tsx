import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  variant?: "default" | "dark" | "glass"
}

export function Section({ children, className, id, variant = "default" }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-20 lg:py-28 section-padding relative",
        variant === "dark" ? "bg-dark-100" : "bg-dark",
        className
      )}
    >
      {variant === "glass" && (
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none" />
      )}
      <div className={cn(
        "relative z-10 max-w-7xl mx-auto",
        variant === "glass" && "section-padding"
      )}>
        {children}
      </div>
    </section>
  )
}

export function SectionHeader({
  title,
  subtitle,
  gold = false,
  className,
  align = "center",
}: {
  title: string
  subtitle?: string
  gold?: boolean
  className?: string
  align?: "center" | "left"
}) {
  return (
    <div
      className={cn(
        "max-w-3xl mb-12 sm:mb-16",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {gold && (
        <div className="inline-flex items-center gap-3 mb-5">
          <div className="w-10 h-0.5 bg-gold" />
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
            Premium Selection
          </span>
          <div className="w-10 h-0.5 bg-gold" />
        </div>
      )}
      <h2
        className={cn(
          "section-heading-gold text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight tracking-wide",
          align === "left" && "section-heading-gold-left"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-8 text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
