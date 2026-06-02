import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAffiliateTokenFromHeader, verifyAffiliateToken } from "@/lib/affiliate"

export async function GET(request: Request) {
  try {
    const token = getAffiliateTokenFromHeader(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyAffiliateToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const url = new URL(request.url)
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"))
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")))

    const where = { affiliateId: payload.sub }

    const [payouts, total] = await Promise.all([
      prisma.payout.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payout.count({ where }),
    ])

    return NextResponse.json({
      payouts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Affiliate payouts error:", error)
    return NextResponse.json({ error: "Failed to load payouts" }, { status: 500 })
  }
}
