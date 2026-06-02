import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromHeader, verifyAdminToken } from "@/lib/affiliate"

export async function GET(request: Request) {
  try {
    const token = getTokenFromHeader(request)
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"))
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")))

    const where: Record<string, unknown> = {}
    if (status && ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"].includes(status)) where.status = status

    const [affiliates, total] = await Promise.all([
      prisma.affiliate.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, firstName: true, lastName: true, email: true, phone: true,
          businessName: true, referralCode: true, status: true, commissionTier: true,
          totalClicks: true, totalReferrals: true, totalEarnings: true,
          createdAt: true,
          _count: { select: { referrals: true, payouts: true } },
        },
      }),
      prisma.affiliate.count({ where }),
    ])

    return NextResponse.json({
      affiliates,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Admin list affiliates error:", error)
    return NextResponse.json({ error: "Failed to load affiliates" }, { status: 500 })
  }
}
