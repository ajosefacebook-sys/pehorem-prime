"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Gauge, Fuel, Calendar, MapPin, ChevronLeft, ChevronRight, Heart, Share2, MessageCircle, Phone, Sparkles, Check, ArrowLeft, Cog, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { featuredVehicles } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { notFound } from "next/navigation"
import { BoostModal } from "@/components/boost/boost-modal"

const vehicleFeatures = [
  "Massage Seats",
  "Night Vision",
  "Head-Up Display",
  "Adaptive Cruise Control",
  "360° Camera",
  "Premium Audio",
  "Apple CarPlay",
  "Wireless Charging",
]

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const vehicle = featuredVehicles.find((v) => v.slug === id)
  if (!vehicle) notFound()
  const [boostModalOpen, setBoostModalOpen] = useState(false)

  const [currentImage, setCurrentImage] = useState(0)
  const [imgError, setImgError] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    document.title = `${vehicle.title} | PEHOREM PRIME`
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement("meta")
      meta.setAttribute("name", "description")
      document.head.appendChild(meta)
    }
    meta.setAttribute("content", vehicle.description.slice(0, 160))
  }, [vehicle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "vehicle",
          referenceId: vehicle.slug,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      })
      if (!res.ok) throw new Error("Failed to submit enquiry")
      setSubmitted(true)
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/vehicles" className="inline-flex items-center gap-2 text-white/40 hover:text-gold text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Vehicles
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-dark-200">
            <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh]">
              {!imgError ? (
                <Image
                  src={vehicle.images[currentImage]}
                  alt={vehicle.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-dark-300">
                  <img src="/placeholder.svg" alt="" className="w-32 h-32 opacity-40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="gold">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {vehicle.isSponsored ? "Featured" : "Premium"}
                </Badge>
                <Badge variant="dark">{vehicle.condition}</Badge>
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
                  {vehicle.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        i === currentImage ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }} />
                    </button>
                  ))}
                </div>
              </div>

              {vehicle.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === 0 ? vehicle.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === vehicle.images.length - 1 ? 0 : prev + 1))}
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
                  {vehicle.location}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
                  {vehicle.title}
                </h1>
                <p className="mt-2 text-2xl sm:text-3xl font-bold gold-text">{formatCurrency(vehicle.price)}</p>
                <p className="text-white/40 text-sm mt-1">{vehicle.condition} · {vehicle.make} · {vehicle.model}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Calendar, label: "Year", value: vehicle.year },
                  { icon: Gauge, label: "Mileage", value: `${vehicle.mileage.toLocaleString()} mi` },
                  { icon: Fuel, label: "Fuel Type", value: vehicle.fuelType },
                  { icon: Cog, label: "Transmission", value: vehicle.transmission },
                ].map((item) => (
                  <div key={item.label} className="glass-card rounded-xl p-4 text-center border border-white/5">
                    <item.icon className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="text-white font-semibold text-lg">{String(item.value)}</p>
                    <p className="text-white/40 text-xs">{item.label}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-xl font-display font-semibold text-white mb-4">Description</h2>
                <p className="text-white/60 leading-relaxed">{vehicle.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-display font-semibold text-white mb-4">Specifications</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-white/40 text-sm">Make</span>
                    <span className="text-white text-sm font-medium">{vehicle.make}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-white/40 text-sm">Model</span>
                    <span className="text-white text-sm font-medium">{vehicle.model}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-white/40 text-sm">Year</span>
                    <span className="text-white text-sm font-medium">{vehicle.year}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-white/40 text-sm">Engine</span>
                    <span className="text-white text-sm font-medium">{vehicle.engineSize}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-white/40 text-sm">Color</span>
                    <span className="text-white text-sm font-medium">{vehicle.color}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-white/40 text-sm">Condition</span>
                    <span className="text-white text-sm font-medium">{vehicle.condition}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-display font-semibold text-white mb-4">Features</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {vehicleFeatures.map((feature) => (
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
                    <p className="text-3xl font-bold text-white">{formatCurrency(vehicle.price)}</p>
                    <p className="text-white/40 text-sm">{vehicle.make} {vehicle.model} · {vehicle.year}</p>
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
                      Schedule Test Drive
                    </Button>
                    <Button variant="gold" size="lg" className="w-full" onClick={() => setBoostModalOpen(true)}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Boost Listing
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-sm font-display font-semibold text-white mb-3">Send Enquiry</h3>
                    {submitted ? (
                      <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 text-center">
                        <Check className="w-8 h-8 text-gold mx-auto mb-2" />
                        <p className="text-white font-medium">Thank you, {formData.name || "Guest"}!</p>
                        <p className="text-white/60 text-sm mt-1">
                          Your enquiry for <span className="text-gold">{vehicle.title}</span> has been received. We will contact you within 24 hours.
                        </p>
                        <button
                          onClick={() => setSubmitted(false)}
                          className="mt-3 text-xs text-gold hover:text-gold-light transition-colors"
                        >
                          Send Another Enquiry
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <Input
                          label="Full Name"
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                        <Input
                          label="Email Address"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                        <Input
                          label="Phone Number"
                          type="tel"
                          placeholder="+234 800 000 0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                        <div>
                          <label className="block text-xs text-white/50 mb-1.5">Message</label>
                          <textarea
                            placeholder="I'm interested in this vehicle..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 resize-none"
                          />
                        </div>
                        {error && <p className="text-red-400 text-xs">{error}</p>}
                        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
                          {submitting ? "Sending..." : "Submit Enquiry"}
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <BoostModal
        isOpen={boostModalOpen}
        onClose={() => setBoostModalOpen(false)}
        listingId={vehicle.slug}
        listingType="vehicle"
        listingTitle={vehicle.title}
      />
    </>
  )
}
