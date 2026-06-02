import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromRequest } from "@/lib/admin"

export async function GET(request: Request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "30")
  const folder = searchParams.get("folder") || ""

  const where: Record<string, unknown> = {}
  if (folder) where.folder = folder

  const [items, total] = await Promise.all([
    prisma.media.findMany({
      where, orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit, take: limit,
    }),
    prisma.media.count({ where }),
  ])
  return NextResponse.json({ items, total, pages: Math.ceil(total / limit) })
}

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const media = await prisma.media.create({
    data: { ...body, uploadedBy: admin.id },
  })
  return NextResponse.json(media)
}
