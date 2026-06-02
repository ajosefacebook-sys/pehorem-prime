import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("password123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@pehoremprime.com" },
    update: {},
    create: {
      email: "admin@pehoremprime.com",
      name: "PEHOREM PRIME Admin",
      password,
      role: "admin",
      isVerified: true,
    },
  })

  const agent = await prisma.user.upsert({
    where: { email: "agent@pehoremprime.com" },
    update: {},
    create: {
      email: "agent@pehoremprime.com",
      name: "Sarah Mitchell",
      password,
      role: "agent",
      isVerified: true,
      company: "PEHOREM PRIME Realty",
      bio: "Senior Luxury Property Consultant with 15+ years experience.",
      rating: 4.9,
      reviewCount: 128,
    },
  })

  const dealer = await prisma.user.upsert({
    where: { email: "dealer@pehoremprime.com" },
    update: {},
    create: {
      email: "dealer@pehoremprime.com",
      name: "Premium Auto Imports Ltd",
      password,
      role: "dealer",
      isVerified: true,
      company: "Premium Auto Imports Ltd",
      bio: "Authorized dealer for the world's finest automotive brands.",
      rating: 4.8,
      reviewCount: 95,
    },
  })

  const properties = [
    {
      title: "The Ivory Palm Villa",
      slug: "ivory-palm-villa",
      description: "A stunning beachfront villa with panoramic ocean views, infinity pool, and private beach access. This architectural masterpiece spans three levels of pure luxury.",
      price: 2500000,
      type: "villa",
      status: "for-sale",
      bedrooms: 6,
      bathrooms: 5,
      area: 8500,
      location: "Victoria Island",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
      latitude: 6.4281,
      longitude: 3.4219,
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200",
      ],
      features: ["Private Pool", "Home Theater", "Wine Cellar", "Smart Home", "Gym"],
      amenities: ["24/7 Security", "Backup Generator", "Staff Quarters", "Parking"],
      yearBuilt: 2023,
      isFeatured: true,
      isSponsored: true,
      isApproved: true,
      agentId: agent.id,
    },
    {
      title: "Skyline Penthouse",
      slug: "skyline-penthouse",
      description: "Ultra-luxury penthouse in the heart of the city with 360-degree views, private rooftop pool, and state-of-the-art smart home technology.",
      price: 4200000,
      type: "apartment",
      status: "for-sale",
      bedrooms: 4,
      bathrooms: 4,
      area: 5200,
      location: "Ikoyi",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
      latitude: 6.4478,
      longitude: 3.4323,
      images: [
        "https://images.unsplash.com/photo-1600595952411-b0e6e7b9f0e1?w=1200",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200",
      ],
      features: ["Rooftop Pool", "Smart Home", "Concierge", "Private Elevator", "Terrace"],
      amenities: ["Valet Parking", "Gym", "Spa", "24/7 Security"],
      yearBuilt: 2024,
      isFeatured: true,
      isApproved: true,
      agentId: agent.id,
    },
    {
      title: "Elysium Estate",
      slug: "elysium-estate",
      description: "A magnificent 8-bedroom estate set on 5 acres of manicured gardens with a private lake, tennis court, and guest house.",
      price: 8500000,
      type: "villa",
      status: "for-sale",
      bedrooms: 8,
      bathrooms: 7,
      area: 15000,
      location: "Banana Island",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
      latitude: 6.4523,
      longitude: 3.4156,
      images: [
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200",
        "https://images.unsplash.com/photo-1600566753086-00f18f6bae57?w=1200",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
      ],
      features: ["Private Lake", "Tennis Court", "Guest House", "Helipad", "Home Theater"],
      amenities: ["Staff Quarters", "Generator", "Borehole", "CCTV"],
      yearBuilt: 2022,
      isFeatured: true,
      isSponsored: true,
      isApproved: true,
      agentId: agent.id,
    },
    {
      title: "Modern Glass House",
      slug: "modern-glass-house",
      description: "A contemporary glass-fronted architectural marvel with minimalist design, infinity pool, and breathtaking sunset views.",
      price: 3200000,
      type: "house",
      status: "for-sale",
      bedrooms: 5,
      bathrooms: 4,
      area: 6200,
      location: "Lekki Phase 1",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
      latitude: 6.4396,
      longitude: 3.4423,
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
        "https://images.unsplash.com/photo-1600595952411-b0e6e7b9f0e1?w=1200",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200",
      ],
      features: ["Infinity Pool", "Smart Home", "Solar Powered", "Home Office"],
      amenities: ["Parking", "Garden", "CCTV", "Generator"],
      yearBuilt: 2024,
      isApproved: true,
      agentId: agent.id,
    },
  ]

  const vehicles = [
    {
      title: "2024 Rolls-Royce Phantom VIII",
      slug: "rolls-royce-phantom-2024",
      description: "The pinnacle of automotive luxury. This Phantom VIII features an extended wheelbase, starlight headliner, and bespoke interior craftsmanship.",
      price: 580000,
      make: "Rolls-Royce",
      model: "Phantom VIII",
      year: 2024,
      mileage: 500,
      fuelType: "petrol",
      transmission: "automatic",
      bodyType: "sedan",
      condition: "new",
      color: "Diamond Black",
      engineSize: "6.75L V12",
      images: [
        "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=1200",
        "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=1200",
        "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200",
      ],
      features: ["Starlight Headliner", "Bespoke Audio", "Massage Seats", "Night Vision", "Rear Entertainment"],
      location: "Victoria Island, Lagos",
      isFeatured: true,
      isSponsored: true,
      isApproved: true,
      dealerId: dealer.id,
    },
    {
      title: "Lamborghini Urus Performante",
      slug: "lamborghini-urus-performante",
      description: "The ultimate luxury SUV with supercar DNA. 657hp twin-turbo V8, 0-60 in 3.3 seconds. Full carbon fiber package.",
      price: 320000,
      make: "Lamborghini",
      model: "Urus Performante",
      year: 2024,
      mileage: 200,
      fuelType: "petrol",
      transmission: "automatic",
      bodyType: "suv",
      condition: "new",
      color: "Arancio Borealis",
      engineSize: "4.0L V8",
      images: [
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200",
        "https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=1200",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200",
      ],
      features: ["Carbon Package", "Sports Exhaust", "Bang & Olufsen Sound", "Adaptive Cruise"],
      location: "Ikoyi, Lagos",
      isFeatured: true,
      isApproved: true,
      dealerId: dealer.id,
    },
    {
      title: "2024 Bentley Continental GT Speed",
      slug: "bentley-continental-gt-speed",
      description: "Grand touring perfection. W12 engine delivering 659hp, 0-60 in 3.5 seconds, with handcrafted British luxury throughout.",
      price: 365000,
      make: "Bentley",
      model: "Continental GT Speed",
      year: 2024,
      mileage: 350,
      fuelType: "petrol",
      transmission: "automatic",
      bodyType: "coupe",
      condition: "new",
      color: "Beluga Black",
      engineSize: "6.0L W12",
      images: [
        "https://images.unsplash.com/photo-1626668014943-13f0e5d15a01?w=1200",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
      ],
      features: ["Naim Audio", "Mulliner Spec", "Night Vision", "Head-Up Display"],
      location: "Lekki, Lagos",
      isFeatured: true,
      isSponsored: true,
      isApproved: true,
      dealerId: dealer.id,
    },
    {
      title: "Porsche 911 Turbo S",
      slug: "porsche-911-turbo-s",
      description: "Iconic German engineering. 640hp, 0-60 in 2.6 seconds. The benchmark for sports car excellence.",
      price: 285000,
      make: "Porsche",
      model: "911 Turbo S",
      year: 2024,
      mileage: 150,
      fuelType: "petrol",
      transmission: "automatic",
      bodyType: "sports",
      condition: "new",
      color: "GT Silver Metallic",
      engineSize: "3.8L Twin-Turbo",
      images: [
        "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200",
      ],
      features: ["Sport Chrono", "PCCB", "Burmester Audio", "Lift System"],
      location: "Abuja, Nigeria",
      isApproved: true,
      dealerId: dealer.id,
    },
  ]

  for (const property of properties) {
    await prisma.property.upsert({
      where: { slug: property.slug },
      update: {},
      create: property,
    })
  }

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { slug: vehicle.slug },
      update: {},
      create: vehicle,
    })
  }

  console.log("Seed complete:", {
    admin: admin.email,
    agent: agent.email,
    dealer: dealer.email,
    properties: properties.length,
    vehicles: vehicles.length,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
