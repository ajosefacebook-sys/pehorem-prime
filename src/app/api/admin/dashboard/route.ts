import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromRequest } from "@/lib/admin"

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

  const pendingProperties = await prisma.property.count({ where: { isApproved: false } })
  const pendingVehicles = await prisma.vehicle.count({ where: { isApproved: false } })
  const featuredProperties = await prisma.property.count({ where: { isFeatured: true } })
  const featuredVehicles = await prisma.vehicle.count({ where: { isFeatured: true } })

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

  const recentInquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, message: true, isRead: true, type: true, createdAt: true },
  })

  return NextResponse.json({
    stats: {
      totalUsers, totalProperties, totalVehicles, totalInquiries, unreadInquiries, totalBlog, totalMedia,
      pendingProperties, pendingVehicles, featuredProperties, featuredVehicles,
      totalListings: totalProperties + totalVehicles,
      pendingApprovals: pendingProperties + pendingVehicles,
    },
    recentProperties,
    recentVehicles,
    recentUsers,
    recentInquiries,
  })
}
