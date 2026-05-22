"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, Bed, Bath, Maximize, MapPin, Grid3X3, List, Sparkles, ChevronDown, GitCompare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardImage, CardContent } from "@/components/ui/card"
import { Section, SectionHeader } from "@/components/ui/section"
import { featuredProperties } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"

const propertyTypes = [
  "All Types",
  "Villa",
  "Apartment",
  "House",
  "Land",
  "Commercial",
  "Office",
  "Warehouse",
  "Rental",
  "Short Let",
]

const locations = [
  "All Locations",
  "Victoria Island",
  "Ikoyi",
  "Lekki",
  "Banana Island",
  "Abuja",
  "Port Harcourt",
]

const priceRanges = [
  { value: "all", label: "Any Price" },
  { value: "0-500000", label: "Under $500K" },
  { value: "500000-1000000", label: "$500K - $1M" },
  { value: "1000000-3000000", label: "$1M - $3M" },
  { value: "3000000-5000000", label: "$3M - $5M" },
  { value: "5000000+", label: "$5M+" },
]

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedPrice, setSelectedPrice] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <>
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Luxury Properties"
            subtitle="Discover extraordinary properties from the world's most prestigious locations"
            gold
            align="left"
          />

          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {propertyTypes.slice(0, 6).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedType === type
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
                More Filters
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
                    <label className="block text-xs text-white/50 mb-2">Property Type</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/40">
                      {propertyTypes.map((t) => (
                        <option key={t} className="bg-dark-200">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Location</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/40">
                      {locations.map((l) => (
                        <option key={l} className="bg-dark-200">{l}</option>
                      ))}
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
                    <input type="checkbox" id="featured" className="accent-gold" />
                    <label htmlFor="featured" className="text-sm text-white/60">Featured Only</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="sponsored" className="accent-gold" />
                    <label htmlFor="sponsored" className="text-sm text-white/60">Sponsored</label>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/50 hover:text-white hover:border-gold/30 transition-all">
                    <GitCompare className="w-3.5 h-3.5" />
                    Compare
                  </button>
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
          {[...featuredProperties, ...featuredProperties.slice(0, 4)].map((property, i) => (
            <motion.div
              key={`${property.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
            >
              <Link href={`/properties/${property.slug}`}>
                <Card>
                  <CardImage className={viewMode === "list" ? "h-48 sm:h-56" : "h-56 sm:h-64"}>
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {property.isSponsored && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="gold">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-xl font-bold text-white">{formatCurrency(property.price)}</p>
                      <p className="text-xs text-white/60 capitalize">{property.type} · {property.status}</p>
                    </div>
                  </CardImage>
                  <CardContent>
                    <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-1">{property.title}</h3>
                    <div className="flex items-center gap-1 text-white/40 text-xs mb-3">
                      <MapPin className="w-3 h-3" />
                      {property.location}, {property.city}
                    </div>
                    <div className="flex items-center gap-4 text-white/50 text-xs">
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {property.bedrooms}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.bathrooms}</span>
                      <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {property.area} {property.areaUnit}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Properties
          </Button>
        </div>
      </Section>
    </>
  )
}
