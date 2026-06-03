import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { type, referenceId, name, email, phone, message } = await request.json()

    if (!type || !name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields: type, name, email, message" }, { status: 400 })
    }

    const inquiry = await prisma.inquiry.create({
      data: { type, referenceId: referenceId || "", name, email, phone: phone || "", message },
    })

    return NextResponse.json(inquiry)
  } catch (err) {
    console.error("Inquiry submission error:", err)
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 })
  }
}
