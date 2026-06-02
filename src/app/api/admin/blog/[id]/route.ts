import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromRequest, createAuditLog } from "@/lib/admin"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const post = await prisma.blogPost.findUnique({
    where: { id }, include: { category: true },
  })
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(post)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await request.json()

  const post = await prisma.blogPost.update({ where: { id }, data: body })
  await createAuditLog({
    action: "UPDATE_BLOG", entity: "BlogPost", entityId: id,
    adminId: admin.id, adminName: admin.name,
    details: { updated: Object.keys(body) },
  })
  return NextResponse.json(post)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await prisma.blogPost.delete({ where: { id } })
  await createAuditLog({
    action: "DELETE_BLOG", entity: "BlogPost", entityId: id,
    adminId: admin.id, adminName: admin.name,
  })
  return NextResponse.json({ success: true })
}
