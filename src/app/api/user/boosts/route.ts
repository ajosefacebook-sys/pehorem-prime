import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromHeader } from "@/lib/admin"
import jwt from "jsonwebtoken"
import { featuredProperties, featuredVehicles } from "@/lib/data"

const JWT_SECRET = process.env.JWT_SECRET || "pehorem-prime-production-secret-2024"

export async function GET(request: Request) {
  const token = getTokenFromHeader(request)
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string }

    const boosts = await prisma.boost.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: "desc" },
    })

    const enriched = boosts.map((boost) => {
      let listing: any = null
      if (boost.listingType === "property")
        listing = featuredProperties.find((p) => p.id === boost.listingId || p.slug === boost.listingId) || null
      if (boost.listingType === "vehicle")
        listing = featuredVehicles.find((v) => v.id === boost.listingId || v.slug === boost.listingId) || null
      return { ...boost, listing }
    })

    return NextResponse.json({ items: enriched })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
