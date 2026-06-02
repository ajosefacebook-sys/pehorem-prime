import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params

    const affiliate = await prisma.affiliate.findUnique({ where: { referralCode: code } })
    if (!affiliate || affiliate.status !== "APPROVED") {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 })
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || ""

    await Promise.all([
      prisma.affiliateClick.create({
        data: { referralCode: code, ipAddress: ip, userAgent },
      }),
      prisma.affiliate.update({
        where: { id: affiliate.id },
        data: { totalClicks: { increment: 1 } },
      }),
    ])

    return NextResponse.json({ valid: true, referralCode: code })
  } catch (error) {
    console.error("Track click error:", error)
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 })
  }
}
