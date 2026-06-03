import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromRequest } from "@/lib/admin"
import { featuredProperties, featuredVehicles } from "@/lib/data"

export async function GET(request: Request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "50")
  const status = searchParams.get("status") || ""
  const paymentStatus = searchParams.get("paymentStatus") || ""
  const search = searchParams.get("search") || ""

  const where: any = {}

  if (status) where.approvalStatus = status
  if (paymentStatus) where.paymentStatus = paymentStatus

  if (search) {
    const vehicleMatchSlugs = featuredVehicles
      .filter(
        (v) =>
          v.title.toLowerCase().includes(search.toLowerCase()) ||
          v.make.toLowerCase().includes(search.toLowerCase()) ||
          v.model.toLowerCase().includes(search.toLowerCase())
      )
      .map((v) => v.slug)

    const propertyMatchSlugs = featuredProperties
      .filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.type.toLowerCase().includes(search.toLowerCase()) ||
          p.location.toLowerCase().includes(search.toLowerCase())
      )
      .map((p) => p.slug)

    const matchSlugs = [...new Set([...vehicleMatchSlugs, ...propertyMatchSlugs])]

    where.OR = [
      { planName: { contains: search, mode: "insensitive" } },
      ...(matchSlugs.length > 0 ? [{ listingId: { in: matchSlugs } }] : []),
    ]
  }

  const [total, items] = await Promise.all([
    prisma.boost.count({ where }),
    prisma.boost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        approvedByUser: { select: { id: true, name: true, email: true } },
      },
    }),
  ])

  const enriched = items.map((boost) => {
    let listing: any = null
    if (boost.listingType === "property")
      listing = featuredProperties.find((p) => p.id === boost.listingId || p.slug === boost.listingId) || null
    if (boost.listingType === "vehicle")
      listing = featuredVehicles.find((v) => v.id === boost.listingId || v.slug === boost.listingId) || null
    return { ...boost, listing }
  })

  return NextResponse.json({
    items: enriched,
    total,
    pages: Math.ceil(total / limit),
    page,
  })
}
