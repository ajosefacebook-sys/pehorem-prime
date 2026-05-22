export interface Property {
  id: string
  title: string
  slug: string
  description: string
  price: number
  currency: string
  type: "land" | "house" | "villa" | "apartment" | "commercial" | "office" | "warehouse" | "rental" | "shortlet"
  status: "for-sale" | "for-rent" | "sold" | "pending"
  bedrooms?: number
  bathrooms?: number
  area: number
  areaUnit: "sqft" | "sqm"
  location: string
  city: string
  state: string
  country: string
  latitude?: number
  longitude?: number
  images: string[]
  video?: string
  virtualTour?: string
  features: string[]
  amenities: string[]
  yearBuilt?: number
  agentId?: string
  isFeatured: boolean
  isSponsored: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Vehicle {
  id: string
  title: string
  slug: string
  description: string
  price: number
  currency: string
  make: string
  model: string
  year: number
  mileage: number
  fuelType: "petrol" | "diesel" | "electric" | "hybrid"
  transmission: "automatic" | "manual"
  bodyType: "sedan" | "suv" | "sports" | "coupe" | "convertible" | "hatchback" | "truck" | "van"
  condition: "new" | "used"
  color: string
  engineSize?: string
  images: string[]
  video?: string
  features: string[]
  location: string
  dealerId?: string
  isFeatured: boolean
  isSponsored: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: "user" | "agent" | "dealer" | "admin"
  isVerified: boolean
  createdAt: Date
}

export interface Agent extends User {
  company?: string
  license?: string
  bio?: string
  rating: number
  reviewCount: number
  portfolio: string[]
  socialLinks?: {
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  properties: Property[]
}

export interface Dealer extends User {
  company: string
  license?: string
  bio?: string
  rating: number
  reviewCount: number
  portfolio: string[]
  socialLinks?: {
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  vehicles: Vehicle[]
}

export interface AdCampaign {
  id: string
  type: "property" | "vehicle"
  referenceId: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  leads: number
  status: "active" | "paused" | "completed"
  startDate: Date
  endDate?: Date
  targetAudience?: string
  targetLocation?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  content: string
  rating: number
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface Inquiry {
  id: string
  type: "property" | "vehicle"
  referenceId: string
  name: string
  email: string
  phone?: string
  message: string
  createdAt: Date
}
