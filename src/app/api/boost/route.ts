import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromHeader, verifyAdminToken } from "@/lib/admin"
import jwt from "jsonwebtoken"
import { featuredProperties, featuredVehicles } from "@/lib/data"

const JWT_SECRET = process.env.JWT_SECRET || "pehorem-prime-production-secret-2024"

function getUserFromRequest(request: Request) {
  const token = getTokenFromHeader(request)
  if (!token) return null
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string }
    return payload
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    const body = await request.json()
    const { listingId, listingType, planName, amount, paymentReference } = body

    if (!listingId || !listingType || !planName || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let listing: any = null
    if (listingType === "property") listing = featuredProperties.find((p) => p.id === listingId || p.slug === listingId)
    if (listingType === "vehicle") listing = featuredVehicles.find((v) => v.id === listingId || v.slug === listingId)
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    const boost = await prisma.boost.create({
      data: {
        userId: user?.id || "",
        listingId: listingId,
        listingType,
        planName,
        amount: parseFloat(amount),
        paymentReference: paymentReference || null,
        paymentStatus: paymentReference ? "verified" : "pending",
        approvalStatus: "pending",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    try {
      const adminUser = await prisma.user.findFirst({
        where: { OR: [{ role: "admin" }, { role: "superadmin" }] },
        orderBy: { createdAt: "asc" },
      })
      if (adminUser) {
        await prisma.notification.create({
          data: {
            type: "boost_request",
            title: `New ${planName} Boost Request`,
            message: `New ${planName} Boost Request for ${listing.title}`,
            userId: adminUser.id,
          },
        })
      }
    } catch {
    }

    return NextResponse.json({ success: true, boost })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
