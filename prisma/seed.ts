import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const client = await prisma.client.upsert({
    where: { slug: 'car-nation-bristol' },
    update: {},
    create: {
      name: 'Car Nation Bristol',
      slug: 'car-nation-bristol',
      ghlLocationId: process.env.GHL_LOCATION_ID || null,
    },
  })

  console.log('Seeded client:', client.id, client.name)

  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12)
  const user = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@carnation.co.uk' },
    update: { role: 'superadmin' },
    create: {
      clientId: client.id,
      email: process.env.ADMIN_EMAIL || 'admin@carnation.co.uk',
      passwordHash: hash,
      name: 'Super Admin',
      role: 'superadmin',
    },
  })

  console.log('Seeded superadmin:', user.id, user.email, `(role: ${user.role})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
