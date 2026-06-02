import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAffiliateTokenFromHeader, verifyAffiliateToken, PAYOUT_MINIMUM } from "@/lib/affiliate"

export async function POST(request: Request) {
  try {
    const token = getAffiliateTokenFromHeader(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyAffiliateToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const { amount } = await request.json()

    if (!amount || amount < PAYOUT_MINIMUM) {
      return NextResponse.json({ error: `Minimum payout amount is ₦${PAYOUT_MINIMUM.toLocaleString()}` }, { status: 400 })
    }

    const affiliate = await prisma.affiliate.findUnique({ where: { id: payload.sub } })
    if (!affiliate) return NextResponse.json({ error: "Affiliate not found" }, { status: 404 })

    const pendingPayouts = await prisma.payout.findMany({
      where: { affiliateId: payload.sub, status: { in: ["PENDING", "PROCESSING"] } },
    })
    const pendingTotal = pendingPayouts.reduce((sum, p) => sum + p.amount, 0)
    const withdrawable = affiliate.totalEarnings - pendingTotal

    if (amount > withdrawable) {
      return NextResponse.json({ error: `Insufficient balance. Available: ₦${withdrawable.toLocaleString()}` }, { status: 400 })
    }

    const payout = await prisma.payout.create({
      data: { affiliateId: payload.sub, amount, status: "PENDING" },
    })

    return NextResponse.json({ message: "Payout request submitted successfully", payout }, { status: 201 })
  } catch (error) {
    console.error("Payout request error:", error)
    return NextResponse.json({ error: "Failed to request payout" }, { status: 500 })
  }
}
