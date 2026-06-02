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
    if (status && ["PENDING", "PROCESSING", "PAID", "REJECTED"].includes(status)) where.status = status

    const [payouts, total] = await Promise.all([
      prisma.payout.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          affiliate: {
            select: {
              id: true, firstName: true, lastName: true, email: true,
              bankName: true, bankAccountNumber: true, bankAccountName: true,
            },
          },
        },
      }),
      prisma.payout.count({ where }),
    ])

    return NextResponse.json({
      payouts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Admin list payouts error:", error)
    return NextResponse.json({ error: "Failed to load payouts" }, { status: 500 })
  }
}
