import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromHeader, verifyAdminToken } from "@/lib/affiliate"

export async function GET(request: Request) {
  try {
    const token = getTokenFromHeader(request)
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [total, pending, approved, rejected, suspended, totalPaidAgg, topAffiliates] = await Promise.all([
      prisma.affiliate.count(),
      prisma.affiliate.count({ where: { status: "PENDING" } }),
      prisma.affiliate.count({ where: { status: "APPROVED" } }),
      prisma.affiliate.count({ where: { status: "REJECTED" } }),
      prisma.affiliate.count({ where: { status: "SUSPENDED" } }),
      prisma.payout.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
      prisma.affiliate.findMany({
        where: { status: "APPROVED" },
        orderBy: { totalReferrals: "desc" },
        take: 10,
        select: {
          id: true, firstName: true, lastName: true, email: true,
          totalReferrals: true, totalEarnings: true, commissionTier: true,
        },
      }),
    ])

    const commissionsPaid = totalPaidAgg._sum?.amount || 0

    return NextResponse.json({
      overview: { total, pending, approved, rejected, suspended, commissionsPaid },
      topAffiliates,
    })
  } catch (error) {
    console.error("Admin analytics error:", error)
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 })
  }
}
