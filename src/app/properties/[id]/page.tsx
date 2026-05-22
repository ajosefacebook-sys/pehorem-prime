"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Bed, Bath, Maximize, Calendar, Home, ChevronLeft, ChevronRight, Heart, Share2, MessageCircle, Phone, Shield, Sparkles, Check, ArrowLeft, GitCompare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { featuredProperties } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { notFound } from "next/navigation"
import { MortgageCalculator } from "@/components/properties/mortgage-calculator"
import { MapView } from "@/components/properties/map-view"
import { PropertyComparison } from "@/components/properties/property-comparison"

const features = [
  "Private Infinity Pool",
  "Smart Home Automation",
  "Home Theater System",
  "Wine Cellar",
  "Fitness Center",
  "Private Elevator",
  "Rooftop Terrace",
  "Helipad Access",
]

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = featuredProperties.find((p) => p.slug === params.id)
  if (!property) notFound()

  const [currentImage, setCurrentImage] = useState(0)

  return (
    <>
      <section className="pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/properties" className="inline-flex items-center gap-2 text-white/40 hover:text-gold text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-dark-200">
            <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh]">
              <Image
                src={property.images[currentImage]}
                alt={property.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="gold">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {property.isSponsored ? "Featured" : "Premium"}
                </Badge>
                <Badge variant="dark" className="uppercase">{property.status}</Badge>
              </div>

              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {property.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        i === currentImage ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              </div>

              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  {property.location}, {property.city}, {property.state}, {property.country}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
                  {property.title}
                </h1>
                <p className="mt-2 text-2xl sm:text-3xl font-bold gold-text">{formatCurrency(property.price)}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Bed, label: "Bedrooms", value: property.bedrooms },
                  { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                  { icon: Maximize, label: "Area", value: `${property.area} ${property.areaUnit}` },
                  { icon: Home, label: "Type", value: property.type },
                ].map((item) => (
                  <div key={item.label} className="glass-card rounded-xl p-4 text-center border border-white/5">
                    <item.icon className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="text-white font-semibold text-lg">{item.value}</p>
                    <p className="text-white/40 text-xs">{item.label}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-xl font-display font-semibold text-white mb-4">Description</h2>
                <p className="text-white/60 leading-relaxed">{property.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-display font-semibold text-white mb-4">Features & Amenities</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-white/60 text-sm">
                      <Check className="w-4 h-4 text-gold flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card hover={false} className="sticky top-24">
                <div className="p-6 space-y-6">
                  <div className="text-center pb-4 border-b border-white/10">
                    <p className="text-3xl font-bold text-white">{formatCurrency(property.price)}</p>
                    <p className="text-white/40 text-sm">{property.type} · {property.status}</p>
                  </div>

                  <div className="space-y-3">
                    <Button variant="primary" size="lg" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Inquire via WhatsApp
                    </Button>
                    <Button variant="outline" size="lg" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Request Callback
                    </Button>
                    <Button variant="dark" size="lg" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Viewing
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <PropertyComparison properties={featuredProperties} />
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-white/10 text-sm text-white/60 hover:text-white hover:border-gold/30 transition-all">
                      <Heart className="w-4 h-4" />
                      Save
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center border border-gold/20">
                        <Shield className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Verified Listing</p>
                        <p className="text-white/40 text-xs">Premium quality assured</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <MortgageCalculator price={property.price} />
            </div>
          </div>

          <div className="mt-8">
            <MapView latitude={property.latitude} longitude={property.longitude} location={`${property.location}, ${property.city}, ${property.country}`} />
          </div>
        </div>
      </section>
    </>
  )
}
