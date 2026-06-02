import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getCommissionTier } from "@/lib/affiliate"

const JWT_SECRET = process.env.JWT_SECRET || "pehorem-prime-production-secret-2024"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, phone, referralCode } = body

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Name is required (min 2 characters)" }, { status: 400 })
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || null,
        password: hashedPassword,
      },
    })

    if (referralCode) {
      try {
        const affiliate = await prisma.affiliate.findUnique({ where: { referralCode } })
        if (affiliate && affiliate.status === "APPROVED") {
          await prisma.referral.create({
            data: {
              affiliateId: affiliate.id,
              referredEmail: email,
              referredName: name,
              planName: "Free Registration",
              planValue: 0,
              commissionRate: getCommissionTier(affiliate.totalReferrals).rate,
              commissionEarned: 0,
              status: "PENDING",
            },
          })
          await prisma.affiliate.update({
            where: { id: affiliate.id },
            data: { totalReferrals: { increment: 1 } },
          })
        }
      } catch {
        // Silently ignore affiliate referral errors; registration succeeds regardless
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error("Registration error:", error)
    const message = error instanceof Error ? error.message : "Registration failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
