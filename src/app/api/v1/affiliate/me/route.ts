import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAffiliateTokenFromHeader, verifyAffiliateToken } from "@/lib/affiliate"

export async function GET(request: Request) {
  try {
    const token = getAffiliateTokenFromHeader(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyAffiliateToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const affiliate = await prisma.affiliate.findUnique({
      where: { id: payload.sub },
      select: {
        id: true, firstName: true, lastName: true, email: true, phone: true,
        businessName: true, businessAddress: true, companyRegNumber: true,
        tin: true, bankName: true, bankAccountNumber: true, bankAccountName: true,
        promotionMethod: true, referralCode: true, status: true, commissionTier: true,
        totalClicks: true, totalReferrals: true, totalEarnings: true,
        createdAt: true,
      },
    })

    if (!affiliate) return NextResponse.json({ error: "Affiliate not found" }, { status: 404 })

    return NextResponse.json({ affiliate })
  } catch (error) {
    console.error("Affiliate me error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const token = getAffiliateTokenFromHeader(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyAffiliateToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const body = await request.json()
    const allowed = ["phone", "businessAddress", "bankName", "bankAccountNumber", "bankAccountName"]
    const updates: Record<string, string> = {}

    for (const field of allowed) {
      if (body[field] !== undefined) updates[field] = body[field]
    }

    const affiliate = await prisma.affiliate.update({
      where: { id: payload.sub },
      data: updates,
      select: {
        id: true, firstName: true, lastName: true, email: true, phone: true,
        businessName: true, businessAddress: true, referralCode: true,
        commissionTier: true, status: true,
      },
    })

    return NextResponse.json({ affiliate })
  } catch (error) {
    console.error("Affiliate update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
