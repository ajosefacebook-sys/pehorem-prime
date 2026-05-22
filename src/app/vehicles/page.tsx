"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, Gauge, Fuel, Calendar, MapPin, SlidersHorizontal, Grid3X3, List, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardImage, CardContent } from "@/components/ui/card"
import { Section, SectionHeader } from "@/components/ui/section"
import { featuredVehicles } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"

const vehicleTypes = [
  "All Types",
  "Sedan",
  "SUV",
  "Sports",
  "Coupe",
  "Convertible",
  "Electric",
]

const brands = [
  "All Brands",
  "Rolls-Royce",
  "Lamborghini",
  "Bentley",
  "Porsche",
  "Ferrari",
  "Mercedes-Benz",
]

const priceRanges = [
  { value: "all", label: "Any Price" },
  { value: "0-100000", label: "Under $100K" },
  { value: "100000-250000", label: "$100K - $250K" },
  { value: "250000-500000", label: "$250K - $500K" },
  { value: "500000+", label: "$500K+" },
]

export default function VehiclesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <>
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Premium Vehicles"
            subtitle="Experience the world's finest automobiles, from timeless classics to cutting-edge hypercars"
            gold
            align="left"
          />

          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {vehicleTypes.map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    type === "All Types"
                      ? "gold-gradient text-black"
                      : "bg-white/5 text-white/60 hover:text-white border border-white/10"
                  }`}
                >
                  {type}
                </button>
              ))}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-white/5 text-white/60 hover:text-white border border-white/10 transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="glass-card rounded-2xl p-5 border border-white/10 space-y-4"
              >
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Brand</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/40">
                      {brands.map((b) => (
                        <option key={b} className="bg-dark-200">{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Condition</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/40">
                      <option className="bg-dark-200">All Conditions</option>
                      <option className="bg-dark-200">New</option>
                      <option className="bg-dark-200">Used</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Price Range</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/40">
                      {priceRanges.map((p) => (
                        <option key={p.value} className="bg-dark-200">{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="vFeatured" className="accent-gold" />
                    <label htmlFor="vFeatured" className="text-sm text-white/60">Featured Only</label>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="flex border border-white/10 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-gold/20 text-gold" : "text-white/40 hover:text-white"}`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-gold/20 text-gold" : "text-white/40 hover:text-white"}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Section>
        <div className={`grid gap-5 sm:gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
          {[...featuredVehicles, ...featuredVehicles.slice(0, 4)].map((vehicle, i) => (
            <motion.div
              key={`${vehicle.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
            >
              <Link href={`/vehicles/${vehicle.slug}`}>
                <Card>
                  <CardImage className={viewMode === "list" ? "h-48 sm:h-56" : "h-56 sm:h-64"}>
                    <Image
                      src={vehicle.images[0]}
                      alt={vehicle.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {vehicle.isSponsored && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="gold">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    {vehicle.condition === "new" && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="gold">Brand New</Badge>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-xl font-bold text-white">{formatCurrency(vehicle.price)}</p>
                      <p className="text-xs text-white/60">{vehicle.make} · {vehicle.model}</p>
                    </div>
                  </CardImage>
                  <CardContent>
                    <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-1">{vehicle.title}</h3>
                    <div className="flex items-center gap-1 text-white/40 text-xs mb-3">
                      <MapPin className="w-3 h-3" />
                      {vehicle.location}
                    </div>
                    <div className="flex items-center gap-4 text-white/50 text-xs">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {vehicle.year}</span>
                      <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> {vehicle.mileage.toLocaleString()} mi</span>
                      <span className="flex items-center gap-1"><Fuel className="w-3.5 h-3.5" /> {vehicle.fuelType}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Vehicles
          </Button>
        </div>
      </Section>
    </>
  )
}
