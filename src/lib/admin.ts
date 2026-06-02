import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "pehorem-prime-production-secret-2024"

export function signAdminToken(user: { id: string; email: string; role: string }) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" })
}

export function verifyAdminToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string }
    return payload.role === "admin" || payload.role === "superadmin" ? payload : null
  } catch {
    return null
  }
}

export function getTokenFromHeader(request: Request): string | null {
  const auth = request.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return null
  return auth.slice(7)
}

export async function getAdminFromRequest(request: Request) {
  const token = getTokenFromHeader(request)
  if (!token) return null
  const payload = verifyAdminToken(token)
  if (!payload) return null
  const user = await prisma.user.findUnique({ where: { id: payload.id } })
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) return null
  return user
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function createAuditLog(params: {
  action: string
  entity?: string
  entityId?: string
  adminId?: string
  adminName?: string
  details?: Prisma.InputJsonValue
  ipAddress?: string
}) {
  return prisma.auditLog.create({ data: params as Prisma.AuditLogCreateInput })
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  if (diffSecs < 60) return "just now"
  const diffMins = Math.floor(diffSecs / 60)
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d)
}
