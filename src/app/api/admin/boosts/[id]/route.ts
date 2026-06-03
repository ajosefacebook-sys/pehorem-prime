import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromRequest } from "@/lib/admin"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await request.json()

  const data: any = {}
  if (body.approvalStatus) {
    data.approvalStatus = body.approvalStatus
    if (body.approvalStatus === "approved" || body.approvalStatus === "rejected") {
      data.approvedBy = admin.id
      data.approvedAt = new Date()
    }
    if (body.approvalStatus === "suspended") {
      data.approvalStatus = "suspended"
    }
  }
  if (body.paymentStatus) data.paymentStatus = body.paymentStatus
  if (body.endDate) data.endDate = new Date(body.endDate)
  if (body.startDate) data.startDate = new Date(body.startDate)

  const boost = await prisma.boost.update({ where: { id }, data })
  return NextResponse.json(boost)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await prisma.boost.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
