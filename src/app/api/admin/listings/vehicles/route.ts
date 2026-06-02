import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromRequest, createAuditLog } from "@/lib/admin"
import { slugify } from "@/lib/utils"

export async function GET(request: Request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const search = searchParams.get("search") || ""
  const make = searchParams.get("make") || ""
  const condition = searchParams.get("condition") || ""

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { make: { contains: search, mode: "insensitive" } },
      { model: { contains: search, mode: "insensitive" } },
    ]
  }
  if (make) where.make = make
  if (condition) where.condition = condition

  const [items, total] = await Promise.all([
    prisma.vehicle.findMany({
      where, orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit, take: limit,
      include: { dealer: { select: { id: true, name: true, email: true } } },
    }),
    prisma.vehicle.count({ where }),
  ])
  return NextResponse.json({ items, total, pages: Math.ceil(total / limit) })
}

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const slug = slugify(`${body.make} ${body.model} ${body.year}`) + "-" + Date.now().toString(36)

  const vehicle = await prisma.vehicle.create({
    data: { ...body, slug },
  })
  await createAuditLog({
    action: "CREATE_VEHICLE", entity: "Vehicle", entityId: vehicle.id,
    adminId: admin.id, adminName: admin.name, details: { title: vehicle.title },
  })
  return NextResponse.json(vehicle)
}
