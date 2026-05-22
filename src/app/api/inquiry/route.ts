import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { type, referenceId, name, email, phone, message } = await request.json()

    const inquiry = await prisma.inquiry.create({
      data: { type, referenceId, name, email, phone, message },
    })

    return NextResponse.json(inquiry)
  } catch {
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 })
  }
}
