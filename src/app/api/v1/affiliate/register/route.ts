import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, generateReferralCode } from "@/lib/affiliate"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone, businessName, businessAddress, companyRegNumber, tin, bankName, bankAccountNumber, bankAccountName, promotionMethod } = body

    if (!email || !password || !firstName || !lastName || !phone || !businessName || !businessAddress || !companyRegNumber || !tin || !bankName || !bankAccountNumber || !bankAccountName || !promotionMethod) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const existing = await prisma.affiliate.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "This email is already registered on Pehorem" }, { status: 409 })
    }

    const referralCode = await generateUniqueReferralCode(firstName)
    const hashed = await hashPassword(password)

    await prisma.affiliate.create({
      data: { email, password: hashed, firstName, lastName, phone, businessName, businessAddress, companyRegNumber, tin, bankName, bankAccountNumber, bankAccountName, promotionMethod, referralCode },
    })

    return NextResponse.json({ message: "Application submitted successfully. We will review and get back to you within 48 hours." }, { status: 201 })
  } catch (error) {
    console.error("Affiliate register error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}

async function generateUniqueReferralCode(firstName: string): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = generateReferralCode(firstName)
    const existing = await prisma.affiliate.findUnique({ where: { referralCode: code } })
    if (!existing) return code
  }
  return `REF-${firstName.toUpperCase()}${Date.now().toString().slice(-4)}`
}
