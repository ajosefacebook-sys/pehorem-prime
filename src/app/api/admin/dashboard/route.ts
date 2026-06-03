import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromRequest } from "@/lib/admin"
import { featuredProperties, featuredVehicles } from "@/lib/data"

export async function GET(request: Request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [totalUsers, totalProperties, totalVehicles, totalInquiries, unreadInquiries, totalBlog, totalMedia] =
    await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.vehicle.count(),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { isRead: false } }),
      prisma.blogPost.count(),
      prisma.media.count(),
    ])

  const [
    pendingProperties, pendingVehicles,
    featuredPropertiesCount, featuredVehiclesCount,
    vehicleInquiries, propertyInquiries,
    newInquiries, contactedInquiries, pendingInquiries, closedInquiries,
    totalBoosts, activeBoosts, pendingBoosts, expiredBoosts, boostRevenue,
  ] = await Promise.all([
    prisma.property.count({ where: { isApproved: false } }),
    prisma.vehicle.count({ where: { isApproved: false } }),
    prisma.property.count({ where: { isFeatured: true } }),
    prisma.vehicle.count({ where: { isFeatured: true } }),
    prisma.inquiry.count({ where: { type: "vehicle" } }),
    prisma.inquiry.count({ where: { type: "property" } }),
    prisma.inquiry.count({ where: { status: "new" } }),
    prisma.inquiry.count({ where: { status: "contacted" } }),
    prisma.inquiry.count({ where: { status: "pending" } }),
    prisma.inquiry.count({ where: { status: "closed" } }),
    prisma.boost.count(),
    prisma.boost.count({ where: { approvalStatus: "approved", endDate: { gte: new Date() } } }),
    prisma.boost.count({ where: { approvalStatus: "pending" } }),
    prisma.boost.count({ where: { endDate: { lt: new Date() }, approvalStatus: "approved" } }),
    prisma.boost.aggregate({ where: { paymentStatus: "verified" }, _sum: { amount: true } }),
  ])

  const recentProperties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, price: true, type: true, status: true, isApproved: true, createdAt: true },
  })

  const recentVehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, price: true, make: true, model: true, isApproved: true, createdAt: true },
  })

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  const recentInquiriesRaw = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const recentInquiries = recentInquiriesRaw.map((inq) => {
    let listing = null
    if (inq.type === "property") listing = featuredProperties.find((p) => p.slug === inq.referenceId) || null
    if (inq.type === "vehicle") listing = featuredVehicles.find((v) => v.slug === inq.referenceId) || null
    return { ...inq, listing }
  })

  return NextResponse.json({
    stats: {
      totalUsers, totalProperties, totalVehicles, totalInquiries, unreadInquiries, totalBlog, totalMedia,
      pendingProperties, pendingVehicles,
      featuredProperties: featuredPropertiesCount, featuredVehicles: featuredVehiclesCount,
      totalListings: totalProperties + totalVehicles,
      pendingApprovals: pendingProperties + pendingVehicles,
      vehicleInquiries, propertyInquiries,
      newInquiries, contactedInquiries, pendingInquiries, closedInquiries,
      totalBoosts, activeBoosts, pendingBoosts, expiredBoosts,
      boostRevenue: boostRevenue._sum.amount || 0,
    },
    recentProperties,
    recentVehicles,
    recentUsers,
    recentInquiries,
  })
}
