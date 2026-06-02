import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "pehorem-prime-production-secret-2024"

export const TIER_THRESHOLDS = [
  { tier: "PLATINUM", minReferrals: 61, rate: 0.15 },
  { tier: "GOLD", minReferrals: 31, rate: 0.12 },
  { tier: "SILVER", minReferrals: 11, rate: 0.08 },
  { tier: "STARTER", minReferrals: 0, rate: 0.05 },
] as const

export function getCommissionTier(totalReferrals: number) {
  for (const t of TIER_THRESHOLDS) {
    if (totalReferrals >= t.minReferrals) return t
  }
  return TIER_THRESHOLDS[TIER_THRESHOLDS.length - 1]
}

export function generateReferralCode(firstName: string): string {
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `REF-${firstName.toUpperCase()}${rand}`
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signAffiliateToken(affiliate: { id: string; email: string }) {
  return jwt.sign({ sub: affiliate.id, email: affiliate.email, type: "affiliate" }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyAffiliateToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email: string; type: string }
    if (payload.type !== "affiliate") return null
    return payload
  } catch {
    return null
  }
}

export function getAffiliateTokenFromHeader(request: Request): string | null {
  const auth = request.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return null
  return auth.slice(7)
}

export async function getAffiliateFromToken(request: Request) {
  const token = getAffiliateTokenFromHeader(request)
  if (!token) return null
  const payload = verifyAffiliateToken(token)
  if (!payload) return null
  const affiliate = await prisma.affiliate.findUnique({ where: { id: payload.sub } })
  if (!affiliate || affiliate.status !== "APPROVED") return null
  return affiliate
}

export function getTierBadgeClass(tier: string) {
  switch (tier) {
    case "STARTER": return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    case "SILVER": return "bg-slate-300/20 text-slate-200 border-slate-300/30"
    case "GOLD": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "PLATINUM": return "bg-blue-100/20 text-blue-200 border-blue-100/30"
    default: return "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }
}

export const PAYOUT_MINIMUM = 10000

export function verifyAdminToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string }
    return payload.role === "admin" ? payload : null
  } catch {
    return null
  }
}

export function getTokenFromHeader(request: Request): string | null {
  const auth = request.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return null
  return auth.slice(7)
}
