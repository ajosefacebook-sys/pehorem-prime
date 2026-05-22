import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const location = searchParams.get("location")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const featured = searchParams.get("featured")

  const where: Record<string, unknown> = { isApproved: true }

  if (type && type !== "all") where.type = type
  if (location && location !== "all") where.location = { contains: location, mode: "insensitive" }
  if (minPrice) where.price = { ...(where.price as object || {}), gte: parseFloat(minPrice) }
  if (maxPrice) where.price = { ...(where.price as object || {}), lte: parseFloat(maxPrice) }
  if (featured === "true") where.isFeatured = true

  try {
    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { agent: { select: { name: true, avatar: true } } },
    })
    return NextResponse.json(properties)
  } catch {
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const property = await prisma.property.create({
      data: {
        ...data,
        slug: data.slug || data.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-"),
      },
    })
    return NextResponse.json(property)
  } catch {
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}
