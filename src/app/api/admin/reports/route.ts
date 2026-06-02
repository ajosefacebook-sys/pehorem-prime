import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromRequest } from "@/lib/admin"

export async function GET(request: Request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "month"
  const now = new Date()

  let startDate: Date
  if (period === "week") startDate = new Date(now.getTime() - 7 * 86400000)
  else if (period === "year") startDate = new Date(now.getFullYear(), 0, 1)
  else startDate = new Date(now.getFullYear(), now.getMonth(), 1)

  const [propertiesPerPeriod, vehiclesPerPeriod, usersPerPeriod, inquiriesPerPeriod] = await Promise.all([
    prisma.property.findMany({ where: { createdAt: { gte: startDate } }, select: { createdAt: true } }),
    prisma.vehicle.findMany({ where: { createdAt: { gte: startDate } }, select: { createdAt: true } }),
    prisma.user.findMany({ where: { createdAt: { gte: startDate } }, select: { createdAt: true, role: true } }),
    prisma.inquiry.findMany({ where: { createdAt: { gte: startDate } }, select: { createdAt: true, type: true } }),
  ])

  const propertiesByType = await prisma.property.groupBy({
    by: ["type"], _count: true,
  })
  const vehiclesByMake = await prisma.vehicle.groupBy({
    by: ["make"], _count: true, orderBy: { _count: { make: "desc" } }, take: 10,
  })
  const usersByRole = await prisma.user.groupBy({
    by: ["role"], _count: true,
  })

  return NextResponse.json({
    period,
    counts: {
      properties: propertiesPerPeriod.length,
      vehicles: vehiclesPerPeriod.length,
      users: usersPerPeriod.length,
      inquiries: inquiriesPerPeriod.length,
    },
    propertiesByType,
    vehiclesByMake,
    usersByRole,
  })
}
