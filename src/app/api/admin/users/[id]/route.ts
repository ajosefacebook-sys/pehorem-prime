import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromRequest, createAuditLog } from "@/lib/admin"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, phone: true, avatar: true, role: true, isVerified: true,
      company: true, bio: true, rating: true, reviewCount: true, createdAt: true, updatedAt: true,
      _count: { select: { properties: true, vehicles: true, inquiries: true, reviews: true } },
    },
  })
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(user)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await request.json()

  const user = await prisma.user.update({ where: { id }, data: body })
  await createAuditLog({
    action: "UPDATE_USER", entity: "User", entityId: id,
    adminId: admin.id, adminName: admin.name,
    details: { updated: Object.keys(body) },
  })
  return NextResponse.json(user)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await prisma.user.delete({ where: { id } })
  await createAuditLog({
    action: "DELETE_USER", entity: "User", entityId: id,
    adminId: admin.id, adminName: admin.name,
  })
  return NextResponse.json({ success: true })
}
