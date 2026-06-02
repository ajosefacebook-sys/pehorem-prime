"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { SlidersHorizontal, Grid3X3, List, ChevronDown, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section, SectionHeader } from "@/components/ui/section"
import { VehicleCard } from "@/components/vehicles/vehicle-card"
import { featuredVehicles } from "@/lib/data"

const vehicleTypes = [
  "All Types", "Sedan", "SUV", "Sports", "Coupe", "Convertible", "Electric", "Truck", "Hatchback", "Van",
]

const brands = [
  "All Brands",
  "Rolls-Royce", "Bentley", "Ferrari", "Lamborghini", "Porsche",
  "Mercedes-Benz", "BMW", "Audi", "Range Rover", "Lexus",
  "Toyota", "Honda", "Hyundai", "Kia", "Nissan",
  "Tesla", "McLaren", "Aston Martin", "BYD",
  "Alfa Romeo", "Cadillac", "Chevrolet", "Ford", "Genesis",
  "GMC", "Infiniti", "Jaguar", "Jeep", "Lucid", "Mahindra",
  "Maserati", "Mazda", "Ram", "Rivian", "Subaru", "Volkswagen", "Volvo",
]

const priceRanges = [
  { value: "all", label: "Any Price" },
  { value: "0-50000", label: "Under $50K" },
  { value: "50000-100000", label: "$50K - $100K" },
  { value: "100000-200000", label: "$100K - $200K" },
  { value: "200000-500000", label: "$200K - $500K" },
  { value: "500000+", label: "$500K+" },
]

const fuelOptions = ["Any", "petrol", "diesel", "hybrid", "electric"]

export default function VehiclesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedType, setSelectedType] = useState("All Types")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [priceRange, setPriceRange] = useState("all")
  const [fuelType, setFuelType] = useState("Any")
  const [featuredOnly, setFeaturedOnly] = useState(false)

  const filtered = useMemo(() => {
    return featuredVehicles.filter((v) => {
      if (selectedType !== "All Types") {
        if (selectedType === "Electric") {
          if (v.fuelType !== "electric") return false
        } else {
          if (v.bodyType !== selectedType.toLowerCase()) return false
        }
      }
      if (selectedBrand !== "All Brands" && v.make !== selectedBrand) return false
      if (featuredOnly && !v.isFeatured) return false
      if (fuelType !== "Any" && v.fuelType !== fuelType) return false
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number)
        if (priceRange.endsWith("+")) {
          if (v.price < Number(priceRange.replace("+", ""))) return false
        } else if (v.price < min || v.price > max) return false
      }
      return true
    })
  }, [selectedType, selectedBrand, priceRange, fuelType, featuredOnly])

  const clearFilters = () => {
    setSelectedType("All Types")
    setSelectedBrand("All Brands")
    setPriceRange("all")
    setFuelType("Any")
    setFeaturedOnly(false)
  }

  const hasActiveFilters = selectedType !== "All Types" || selectedBrand !== "All Brands" || priceRange !== "all" || fuelType !== "Any" || featuredOnly

  return (
    <>
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Premium Vehicles"
            subtitle="Discover the world's finest automobiles from luxury sedans to hypercars"
            gold
            align="left"
          />

          <div className="mt-6 sm:mt-8 space-y-4">
            {/* Type/ Category Tabs - horizontally scrollable on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 sm:mx-0 px-4 sm:px-0">
              {vehicleTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
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
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm border transition-all shrink-0 ${
                  showFilters ? "bg-gold/20 text-gold border-gold/30" : "bg-white/5 text-white/60 hover:text-white border-white/10"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">More Filters</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Expandable Filter Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 space-y-4"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Brand</label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-gold/40"
                    >
                      {brands.map((b) => (
                        <option key={b} className="bg-dark-200">{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Category</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-gold/40"
                    >
                      {vehicleTypes.map((t) => (
                        <option key={t} className="bg-dark-200">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Price Range</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-gold/40"
                    >
                      {priceRanges.map((p) => (
                        <option key={p.value} className="bg-dark-200">{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Fuel Type</label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-gold/40"
                    >
                      {fuelOptions.map((f) => (
                        <option key={f} className="bg-dark-200">{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featuredOnly}
                        onChange={(e) => setFeaturedOnly(e.target.checked)}
                        className="accent-gold w-4 h-4"
                      />
                      <span className="text-xs sm:text-sm text-white/60">Featured Only</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gold/20 text-gold" : "text-white/40 hover:text-white"}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-gold/20 text-gold" : "text-white/40 hover:text-white"}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-xs text-white/40 hover:text-gold transition-colors"
                    >
                      <X className="w-3 h-3" /> Clear Filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Section>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/30">
            <Search className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium text-white/50">No vehicles found</p>
            <p className="text-sm mt-1">Try adjusting your filter criteria</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-gold/10 text-gold text-sm hover:bg-gold/20 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-white/40">
                Showing <span className="text-white">{filtered.length}</span> vehicles
              </p>
            </div>
            <div className={`grid gap-4 sm:gap-5 lg:gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 max-w-3xl mx-auto"
            }`}>
              {filtered.map((vehicle, i) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 12) * 0.05 }}
                >
                  <VehicleCard
                    slug={vehicle.slug}
                    title={vehicle.title}
                    price={vehicle.price}
                    make={vehicle.make}
                    model={vehicle.model}
                    year={vehicle.year}
                    mileage={vehicle.mileage}
                    fuelType={vehicle.fuelType}
                    transmission={vehicle.transmission}
                    condition={vehicle.condition}
                    location={vehicle.location}
                    image={vehicle.images[0]}
                    isSponsored={vehicle.isSponsored}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Vehicles
          </Button>
        </div>
      </Section>
    </>
  )
}
