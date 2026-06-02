"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Gauge, Fuel, MapPin, ArrowRight, Sparkles, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardImage, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Section, SectionHeader } from "@/components/ui/section"
import { SectionBackground } from "@/components/ui/section-background"
import { featuredVehicles } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"

const vehicleSlides = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b",
  "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
  "https://images.unsplash.com/photo-1563720222394-4b13b5d62f77",
  "https://images.unsplash.com/photo-1614200187524-dc4b892acf16",
]

export function FeaturedVehicles() {
  return (
    <Section variant="default">
      <SectionBackground slides={vehicleSlides} />
      <SectionHeader
        title="Premium Vehicles Collection"
        subtitle="Exclusive selection of the world's finest automobiles"
        gold
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {featuredVehicles.slice(0, 4).map((vehicle, i) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={`/vehicles/${vehicle.slug}`}>
              <Card>
                <CardImage className="h-56 sm:h-64">
                  <Image
                    src={vehicle.images[0]}
                    alt={vehicle.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
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
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(vehicle.price)}
                    </p>
                    <p className="text-xs text-white/60">{vehicle.condition} · {vehicle.make}</p>
                  </div>
                </CardImage>
                <CardContent>
                  <h3 className="font-display text-gold font-semibold text-sm leading-snug mb-1 line-clamp-1">
                    {vehicle.title}
                  </h3>
                  <div className="flex items-center gap-1 text-white/40 text-xs mb-3">
                    <MapPin className="w-3 h-3 text-gold/60" />
                    {vehicle.location}
                  </div>
                  <div className="flex items-center gap-4 text-white/50 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gold/60" /> {vehicle.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-gold/60" /> {vehicle.mileage.toLocaleString()} mi
                    </span>
                    <span className="flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-gold/60" /> {vehicle.fuelType}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <Link href="/vehicles">
          <Button variant="gold" size="lg">
            View All Vehicles
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </Section>
  )
}
