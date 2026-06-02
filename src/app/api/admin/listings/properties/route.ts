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
  const status = searchParams.get("status") || ""
  const type = searchParams.get("type") || ""

  const where: Record<string, unknown> = {}
  if (search) where.title = { contains: search, mode: "insensitive" }
  if (status) where.status = status
  if (type) where.type = type

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where, orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit, take: limit,
      include: { agent: { select: { id: true, name: true, email: true } } },
    }),
    prisma.property.count({ where }),
  ])
  return NextResponse.json({ items, total, pages: Math.ceil(total / limit) })
}

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const slug = slugify(body.title) + "-" + Date.now().toString(36)

  const property = await prisma.property.create({
    data: { ...body, slug },
  })
  await createAuditLog({
    action: "CREATE_PROPERTY", entity: "Property", entityId: property.id,
    adminId: admin.id, adminName: admin.name, details: { title: property.title },
  })
  return NextResponse.json(property)
}
