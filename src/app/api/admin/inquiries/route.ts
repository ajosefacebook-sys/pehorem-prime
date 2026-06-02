import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromRequest } from "@/lib/admin"

export async function GET(request: Request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const type = searchParams.get("type") || ""
  const read = searchParams.get("read") || ""

  const where: Record<string, unknown> = {}
  if (type) where.type = type
  if (read === "unread") where.isRead = false
  if (read === "read") where.isRead = true

  const [items, total] = await Promise.all([
    prisma.inquiry.findMany({
      where, orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit, take: limit,
    }),
    prisma.inquiry.count({ where }),
  ])
  return NextResponse.json({ items, total, pages: Math.ceil(total / limit) })
}
