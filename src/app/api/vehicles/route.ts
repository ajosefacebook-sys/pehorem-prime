import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const make = searchParams.get("make")
  const condition = searchParams.get("condition")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const featured = searchParams.get("featured")

  const where: Record<string, unknown> = { isApproved: true }

  if (make && make !== "all") where.make = { contains: make, mode: "insensitive" }
  if (condition && condition !== "all") where.condition = condition
  if (minPrice) where.price = { ...(where.price as object || {}), gte: parseFloat(minPrice) }
  if (maxPrice) where.price = { ...(where.price as object || {}), lte: parseFloat(maxPrice) }
  if (featured === "true") where.isFeatured = true

  try {
    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { dealer: { select: { name: true, avatar: true } } },
    })
    return NextResponse.json(vehicles)
  } catch {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
        slug: data.slug || `${data.make}-${data.model}-${data.year}`.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-"),
      },
    })
    return NextResponse.json(vehicle)
  } catch {
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 })
  }
}
