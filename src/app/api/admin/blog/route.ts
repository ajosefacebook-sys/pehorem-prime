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
  const category = searchParams.get("category") || ""

  const where: Record<string, unknown> = {}
  if (category) where.categoryId = category

  const [posts, total, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where, orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit, take: limit,
      include: { category: true },
    }),
    prisma.blogPost.count({ where }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ])
  return NextResponse.json({ posts, total, pages: Math.ceil(total / limit), categories })
}

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const slug = slugify(body.title) + "-" + Date.now().toString(36)

  const post = await prisma.blogPost.create({
    data: { ...body, slug },
  })
  await createAuditLog({
    action: "CREATE_BLOG", entity: "BlogPost", entityId: post.id,
    adminId: admin.id, adminName: admin.name, details: { title: post.title },
  })
  return NextResponse.json(post)
}
