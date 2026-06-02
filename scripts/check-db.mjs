import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
try {
  const users = await p.user.findMany()
  console.log(JSON.stringify(users.map(x => ({email:x.email,role:x.role})), null, 2))
  const props = await p.property.findMany()
  console.log('Properties:', props.length)
  const vehs = await p.vehicle.findMany()
  console.log('Vehicles:', vehs.length)
} catch(e) {
  console.error('Error:', e.message, e.stack)
} finally {
  await p.$disconnect()
}
