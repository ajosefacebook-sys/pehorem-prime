"use client"

import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function Select({ className, label, options, ...props }: SelectProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-white/60 mb-2">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white",
          "focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50",
          "transition-all duration-300 appearance-none cursor-pointer",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-dark-200 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
