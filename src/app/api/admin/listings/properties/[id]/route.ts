import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromRequest, createAuditLog } from "@/lib/admin"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  const item = await prisma.property.update({ where: { id }, data: body })
  await createAuditLog({
    action: "UPDATE_PROPERTY", entity: "Property", entityId: id,
    adminId: admin.id, adminName: admin.name,
    details: { updated: Object.keys(body) },
  })
  return NextResponse.json(item)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await prisma.property.delete({ where: { id } })
  await createAuditLog({
    action: "DELETE_PROPERTY", entity: "Property", entityId: id,
    adminId: admin.id, adminName: admin.name,
  })
  return NextResponse.json({ success: true })
}
