"use client"

import { MapPin } from "lucide-react"

interface MapViewProps {
  latitude?: number
  longitude?: number
  location: string
}

export function MapView({ latitude, longitude, location }: MapViewProps) {
  const hasCoords = latitude && longitude

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
      <div className="p-5 pb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gold" />
          <h3 className="text-lg font-display font-semibold text-white">Location</h3>
        </div>
        <p className="text-white/50 text-sm mt-1">{location}</p>
      </div>

      <div className="relative h-64 sm:h-80 bg-dark-200 overflow-hidden">
        {hasCoords ? (
          <iframe
            title="Property Location"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg)" }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">Map preview available</p>
              <p className="text-white/20 text-xs mt-1">{location}</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 right-3">
          <a
            href={
              hasCoords
                ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
                : `https://www.google.com/maps/search/${encodeURIComponent(location)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card px-4 py-2 rounded-xl text-xs text-white hover:text-gold border border-white/10 hover:border-gold/30 transition-all inline-flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" />
            Get Directions
          </a>
        </div>
      </div>
    </div>
  )
}
