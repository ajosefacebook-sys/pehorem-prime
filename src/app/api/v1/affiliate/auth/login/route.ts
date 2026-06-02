import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { comparePassword, signAffiliateToken } from "@/lib/affiliate"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const affiliate = await prisma.affiliate.findUnique({ where: { email } })
    if (!affiliate) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (affiliate.status === "PENDING") {
      return NextResponse.json({ error: "Your application is still under review. Please check back later.", status: "pending" }, { status: 403 })
    }

    if (affiliate.status === "REJECTED") {
      return NextResponse.json({ error: `Your application was rejected. Reason: ${affiliate.rejectionReason || "Not specified"}`, status: "rejected" }, { status: 403 })
    }

    if (affiliate.status === "SUSPENDED") {
      return NextResponse.json({ error: "Your account has been suspended. Please contact support.", status: "suspended" }, { status: 403 })
    }

    const valid = await comparePassword(password, affiliate.password)
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = signAffiliateToken(affiliate)

    return NextResponse.json({
      token,
      affiliate: {
        id: affiliate.id,
        firstName: affiliate.firstName,
        lastName: affiliate.lastName,
        email: affiliate.email,
        referralCode: affiliate.referralCode,
        commissionTier: affiliate.commissionTier,
        status: affiliate.status,
      },
    })
  } catch (error) {
    console.error("Affiliate login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
