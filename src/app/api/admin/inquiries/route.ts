import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromRequest } from "@/lib/admin"
import { featuredProperties } from "@/lib/data"
import { featuredVehicles } from "@/lib/data"

export async function GET(request: Request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const type = searchParams.get("type") || ""
  const read = searchParams.get("read") || ""
  const search = searchParams.get("search") || ""

  const where: Record<string, unknown> = {}
  if (type) where.type = type
  if (read === "unread") where.isRead = false
  if (read === "read") where.isRead = true
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
    ]
  }

  const [items, total] = await Promise.all([
    prisma.inquiry.findMany({
      where, orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit, take: limit,
    }),
    prisma.inquiry.count({ where }),
  ])

  const enriched = items.map((inq) => {
    let listing = null
    if (inq.type === "property" || inq.type === "property-enquiry") {
      listing = featuredProperties.find((p) => p.slug === inq.referenceId) || null
    }
    if (inq.type === "vehicle" || inq.type === "vehicle-enquiry") {
      listing = featuredVehicles.find((v) => v.slug === inq.referenceId) || null
    }
    return { ...inq, listing }
  })

  return NextResponse.json({ items: enriched, total, pages: Math.ceil(total / limit) })
}
