"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Star, Phone, Mail, MapPin, Shield, Globe, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardImage, CardContent } from "@/components/ui/card"
import { featuredVehicles } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"

const dealer = {
  name: "Premium Auto Imports Ltd",
  title: "Authorized Luxury Vehicle Dealer",
  avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
  location: "Victoria Island, Lagos",
  rating: 4.8,
  reviewCount: 95,
  bio: "Premium Auto Imports Ltd is an authorized dealer for the world's finest automotive brands. With over 20 years of experience, we specialize in sourcing and delivering premium vehicles to discerning clients across Africa.",
  specialties: ["Exotic Cars", "Luxury SUVs", "Limited Editions", "Bespoke Orders"],
}

export default function DealerPage() {
  return (
    <>
      <section className="pt-24 sm:pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6 border border-white/10 text-center sticky top-24">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden mx-auto mb-4 border-2 border-gold/30">
                  <Image src={dealer.avatar} alt={dealer.name} fill className="object-cover" sizes="128px" />
                </div>
                <Badge variant="gold" className="mb-3">
                  <Award className="w-3 h-3 mr-1" />
                  Authorized Dealer
                </Badge>
                <h1 className="text-xl font-display font-bold text-white">{dealer.name}</h1>
                <p className="text-gold text-sm">{dealer.title}</p>
                <p className="text-white/40 text-xs mt-1">{dealer.location}</p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="text-white font-semibold">{dealer.rating}</span>
                  <span className="text-white/40 text-sm">({dealer.reviewCount} reviews)</span>
                </div>
                <div className="mt-6 space-y-3">
                  <Button variant="primary" size="md" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Dealer
                  </Button>
                  <Button variant="outline" size="md" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex justify-center gap-3">
                    {[Globe, Globe, Globe].map((Icon, i) => (
                      <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-gold hover:bg-gold/10 transition-all">
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-white mb-4">About</h2>
                <p className="text-white/60 leading-relaxed">{dealer.bio}</p>
              </div>

              <div>
                <h2 className="text-xl font-display font-semibold text-white mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {dealer.specialties.map((s) => (
                    <Badge key={s} variant="outline" className="px-4 py-2">{s}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-display font-semibold text-white mb-4">Inventory ({featuredVehicles.length})</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {featuredVehicles.map((vehicle) => (
                    <Card key={vehicle.id}>
                      <CardImage className="h-40">
                        <Image src={vehicle.images[0]} alt={vehicle.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-3">
                          <p className="text-sm font-bold text-white">{formatCurrency(vehicle.price)}</p>
                        </div>
                      </CardImage>
                      <CardContent>
                        <h3 className="text-white font-semibold text-sm">{vehicle.title}</h3>
                        <p className="text-white/40 text-xs mt-1">{vehicle.year} · {vehicle.mileage.toLocaleString()} mi</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
