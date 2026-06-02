"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, GitCompare } from "lucide-react"
import { featuredProperties } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import type { Property } from "@/types"

interface PropertyComparisonProps {
  properties?: Property[]
}

export function PropertyComparison({ properties = featuredProperties.slice(0, 4) }: PropertyComparisonProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([properties[0]?.id, properties[1]?.id].filter(Boolean))
  const [isOpen, setIsOpen] = useState(false)

  const selected = properties.filter((p) => selectedIds.includes(p.id))

  const toggleProperty = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id))
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id])
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-white/10 text-sm text-white/60 hover:text-white hover:border-gold/30 transition-all"
      >
        <GitCompare className="w-4 h-4" />
        Compare ({selectedIds.length})
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl border border-white/10 p-6 sm:p-8"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <GitCompare className="w-6 h-6 text-gold" />
                <h2 className="text-2xl font-display font-bold text-white">Property Comparison</h2>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {properties.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => toggleProperty(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                      selectedIds.includes(p.id)
                        ? "gold-gradient text-black font-medium"
                        : "bg-white/5 text-white/50 hover:text-white border border-white/10"
                    } ${selectedIds.length >= 3 && !selectedIds.includes(p.id) ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {p.title.slice(0, 20)}...
                  </button>
                ))}
              </div>

              {selected.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 pr-4 text-white/40 font-medium w-40">Feature</th>
                        {selected.map((p) => (
                          <th key={p.id} className="text-center py-3 px-4 min-w-[200px]">
                            <div className="relative h-32 rounded-xl overflow-hidden mb-2">
                              <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="200px" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }} />
                            </div>
                            <p className="text-white font-semibold text-sm">{p.title}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Price", render: (p: Property) => formatCurrency(p.price) },
                        { label: "Type", render: (p: Property) => p.type },
                        { label: "Status", render: (p: Property) => p.status },
                        { label: "Location", render: (p: Property) => `${p.location}, ${p.city}` },
                        { label: "Bedrooms", render: (p: Property) => p.bedrooms?.toString() || "N/A" },
                        { label: "Bathrooms", render: (p: Property) => p.bathrooms?.toString() || "N/A" },
                        { label: "Area", render: (p: Property) => `${p.area} ${p.areaUnit}` },
                        { label: "Year Built", render: (p: Property) => p.yearBuilt?.toString() || "N/A" },
                      ].map((row) => (
                        <tr key={row.label} className="border-b border-white/5">
                          <td className="py-3 pr-4 text-white/40">{row.label}</td>
                          {selected.map((p) => (
                            <td key={p.id} className="text-center py-3 px-4 text-white">
                              {row.render(p)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
