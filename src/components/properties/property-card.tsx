"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bed, Bath, Maximize, MapPin, Sparkles, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface PropertyCardProps {
  slug: string
  title: string
  price: number
  type: string
  status: string
  location: string
  city: string
  bedrooms?: number
  bathrooms?: number
  area: number
  areaUnit?: string
  image: string
  isSponsored?: boolean
}

export function PropertyCard({
  slug,
  title,
  price,
  type,
  status,
  location,
  city,
  bedrooms,
  bathrooms,
  area,
  areaUnit = "sqft",
  image,
  isSponsored,
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className="group glass-card relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full"
      style={{
        border: isHovered ? "1px solid #C9A84C" : "1px solid rgba(201, 168, 76, 0.4)",
        boxShadow: isHovered ? "0 4px 24px rgba(201, 168, 76, 0.3)" : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/properties/${slug}`} className="block">
        <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden bg-dark-300">
          {!imgError ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white/20 text-sm">
              Image unavailable
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {isSponsored && (
            <div className="absolute top-3 left-3">
              <Badge variant="gold">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-lg sm:text-xl font-bold text-white">{formatCurrency(price)}</p>
            <p className="text-xs text-white/60 capitalize">{type} &middot; {status}</p>
          </div>
        </div>
      </Link>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <Link href={`/properties/${slug}`}>
          <h3 className="font-display font-semibold text-sm leading-snug mb-1 line-clamp-1 text-gold">
            {title}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-white/40 text-xs mb-3">
          <MapPin className="w-3 h-3 text-gold/60 shrink-0" />
          <span className="truncate">{location}, {city}</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 text-white/50 text-xs flex-wrap">
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-gold/60 shrink-0" /> {bedrooms ?? "N/A"}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-gold/60 shrink-0" /> {bathrooms ?? "N/A"}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="w-3.5 h-3.5 text-gold/60 shrink-0" /> {area} {areaUnit}
          </span>
        </div>
        <div className="mt-auto pt-3">
          <Link href={`/properties/${slug}`}>
            <Button variant="outline" size="sm" className="w-full text-xs">
              View Details <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
