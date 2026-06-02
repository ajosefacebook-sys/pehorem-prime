"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Bed, Bath, Maximize, MapPin, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardImage, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Section, SectionHeader } from "@/components/ui/section"
import { SectionBackground } from "@/components/ui/section-background"
import { featuredProperties } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"

const propertySlides = [
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  "https://images.unsplash.com/photo-1600573472550-8090b5e0745e",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
]

export function FeaturedProperties() {
  return (
    <Section variant="default">
      <SectionBackground slides={propertySlides} />
      <SectionHeader
        title="Featured Luxury Properties"
        subtitle="Handpicked premium properties from the world's most exclusive locations"
        gold
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {featuredProperties.slice(0, 4).map((property, i) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={`/properties/${property.slug}`}>
              <Card>
                <CardImage className="h-56 sm:h-64">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
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
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(property.price)}
                    </p>
                    <p className="text-xs text-white/60 capitalize">{property.type} · {property.status}</p>
                  </div>
                </CardImage>
                <CardContent>
                  <h3 className="font-display text-gold font-semibold text-sm leading-snug mb-1 line-clamp-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-white/40 text-xs mb-3">
                    <MapPin className="w-3 h-3 text-gold/60" />
                    {property.location}, {property.city}
                  </div>
                  <div className="flex items-center gap-4 text-white/50 text-xs">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-gold/60" /> {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-gold/60" /> {property.bathrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-3.5 h-3.5 text-gold/60" /> {property.area} {property.areaUnit}
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
        <Link href="/properties">
          <Button variant="gold" size="lg">
            View All Properties
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </Section>
  )
}
