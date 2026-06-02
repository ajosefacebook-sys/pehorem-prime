import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromRequest, createAuditLog } from "@/lib/admin"

export async function GET() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: "default" } })
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { id: "default" } })
  }
  return NextResponse.json(settings)
}

export async function PATCH(request: Request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...body },
    update: body,
  })
  await createAuditLog({
    action: "UPDATE_SETTINGS", entity: "SiteSettings",
    adminId: admin.id, adminName: admin.name,
    details: { updated: Object.keys(body) },
  })
  return NextResponse.json(settings)
}
