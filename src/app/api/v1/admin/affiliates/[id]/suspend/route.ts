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

    const affiliate = await prisma.affiliate.findUnique({ where: { id } })
    if (!affiliate) return NextResponse.json({ error: "Affiliate not found" }, { status: 404 })

    const newStatus = affiliate.status === "SUSPENDED" ? "APPROVED" : "SUSPENDED"

    const updated = await prisma.affiliate.update({
      where: { id },
      data: { status: newStatus },
      select: { id: true, firstName: true, lastName: true, email: true, status: true },
    })

    return NextResponse.json({
      message: newStatus === "SUSPENDED" ? "Affiliate suspended" : "Affiliate reinstated",
      affiliate: updated,
    })
  } catch (error) {
    console.error("Admin suspend/reinstate affiliate error:", error)
    return NextResponse.json({ error: "Failed to update affiliate" }, { status: 500 })
  }
}
