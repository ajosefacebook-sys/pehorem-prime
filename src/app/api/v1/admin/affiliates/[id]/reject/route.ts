import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromHeader, verifyAdminToken } from "@/lib/affiliate"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromHeader(request)
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { reason } = await request.json()

    if (!reason) {
      return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 })
    }

    const affiliate = await prisma.affiliate.findUnique({ where: { id } })
    if (!affiliate) return NextResponse.json({ error: "Affiliate not found" }, { status: 404 })
    if (affiliate.status !== "PENDING") {
      return NextResponse.json({ error: "Affiliate is not in pending status" }, { status: 400 })
    }

    const updated = await prisma.affiliate.update({
      where: { id },
      data: { status: "REJECTED", rejectionReason: reason },
      select: { id: true, firstName: true, lastName: true, email: true, status: true, rejectionReason: true },
    })

    return NextResponse.json({ message: "Affiliate rejected", affiliate: updated })
  } catch (error) {
    console.error("Admin reject affiliate error:", error)
    return NextResponse.json({ error: "Failed to reject affiliate" }, { status: 500 })
  }
}
