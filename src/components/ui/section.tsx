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
        "py-16 sm:py-20 lg:py-28 section-padding",
        {
          "bg-dark": variant === "default",
          "bg-dark-100": variant === "dark",
          "bg-dark relative": variant === "glass",
        },
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
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-8 h-px bg-gold/60" />
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
            Premium Selection
          </span>
          <div className="w-8 h-px bg-gold/60" />
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
