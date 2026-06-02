import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAffiliateTokenFromHeader, verifyAffiliateToken, getCommissionTier, PAYOUT_MINIMUM } from "@/lib/affiliate"

export async function GET(request: Request) {
  try {
    const token = getAffiliateTokenFromHeader(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyAffiliateToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const affiliate = await prisma.affiliate.findUnique({
      where: { id: payload.sub },
      include: {
        referrals: { orderBy: { createdAt: "desc" }, take: 10 },
        payouts: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    })

    if (!affiliate) return NextResponse.json({ error: "Affiliate not found" }, { status: 404 })

    const pendingPayouts = affiliate.payouts
      .filter(p => p.status === "PENDING" || p.status === "PROCESSING")
      .reduce((sum, p) => sum + p.amount, 0)

    const withdrawable = Math.max(0, affiliate.totalEarnings - pendingPayouts)
    const tier = getCommissionTier(affiliate.totalReferrals)

    const totalPaid = affiliate.payouts
      .filter(p => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0)

    return NextResponse.json({
      affiliate: {
        id: affiliate.id,
        firstName: affiliate.firstName,
        lastName: affiliate.lastName,
        referralCode: affiliate.referralCode,
        commissionTier: affiliate.commissionTier,
        totalClicks: affiliate.totalClicks,
        totalReferrals: affiliate.totalReferrals,
        totalEarnings: affiliate.totalEarnings,
      },
      stats: {
        totalClicks: affiliate.totalClicks,
        totalReferrals: affiliate.totalReferrals,
        totalEarnings: affiliate.totalEarnings,
        pendingPayouts,
        withdrawable,
        totalPaid,
      },
      tier: {
        current: affiliate.commissionTier,
        nextTier: tier.tier !== affiliate.commissionTier ? tier.tier : null,
        nextTierRate: tier.rate,
        nextTierNeeded: Math.max(0, tier.minReferrals - affiliate.totalReferrals),
        referralsToNextTier: getReferralsToNextTier(affiliate.totalReferrals),
      },
      recentReferrals: affiliate.referrals,
      recentPayouts: affiliate.payouts,
      canRequestPayout: withdrawable >= PAYOUT_MINIMUM,
      payoutMinimum: PAYOUT_MINIMUM,
    })
  } catch (error) {
    console.error("Affiliate dashboard error:", error)
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 })
  }
}

function getReferralsToNextTier(current: number) {
  if (current < 11) return { target: "SILVER", needed: 11 - current, totalNeeded: 11 }
  if (current < 31) return { target: "GOLD", needed: 31 - current, totalNeeded: 31 }
  if (current < 61) return { target: "PLATINUM", needed: 61 - current, totalNeeded: 61 }
  return { target: "PLATINUM", needed: 0, totalNeeded: 61 }
}
