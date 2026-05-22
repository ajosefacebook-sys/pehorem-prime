import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@pehoremprime.com" },
    update: {},
    create: {
      email: "admin@pehoremprime.com",
      name: "PEHOREM PRIME Admin",
      password: "$2a$12$LJ3m4ys3Lk0TSwHnbfOMiOXPm1Q5q3q3q3q3q3q3q3q3q3q3q",
      role: "admin",
      isVerified: true,
    },
  })

  const agent = await prisma.user.upsert({
    where: { email: "agent@pehoremprime.com" },
    update: {},
    create: {
      email: "agent@pehoremprime.com",
      name: "Sarah Mitchell",
      password: "$2a$12$LJ3m4ys3Lk0TSwHnbfOMiOXPm1Q5q3q3q3q3q3q3q3q3q3q3q",
      role: "agent",
      isVerified: true,
      company: "PEHOREM PRIME Realty",
      bio: "Senior Luxury Property Consultant with 15+ years experience.",
      rating: 4.9,
      reviewCount: 128,
    },
  })

  console.log("Seed data created:", { admin: admin.email, agent: agent.email })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
