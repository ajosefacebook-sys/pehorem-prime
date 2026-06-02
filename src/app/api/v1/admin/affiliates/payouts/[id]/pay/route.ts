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
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json({ error: "Payment reference is required" }, { status: 400 })
    }

    const payout = await prisma.payout.findUnique({ where: { id } })
    if (!payout) return NextResponse.json({ error: "Payout not found" }, { status: 404 })
    if (payout.status !== "PENDING" && payout.status !== "PROCESSING") {
      return NextResponse.json({ error: "Payout is not pending" }, { status: 400 })
    }

    const updated = await prisma.payout.update({
      where: { id },
      data: { status: "PAID", reference, paidAt: new Date() },
    })

    return NextResponse.json({ message: "Payout marked as paid", payout: updated })
  } catch (error) {
    console.error("Admin mark payout paid error:", error)
    return NextResponse.json({ error: "Failed to update payout" }, { status: 500 })
  }
}
