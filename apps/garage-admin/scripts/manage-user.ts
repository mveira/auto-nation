#!/usr/bin/env npx tsx
/**
 * User management CLI for garage-admin.
 *
 * Usage:
 *   npx tsx scripts/manage-user.ts create --email admin@example.com --password secret --name "John" --role superadmin
 *   npx tsx scripts/manage-user.ts create --email tech@example.com --password secret --name "Tech" --role admin
 *   npx tsx scripts/manage-user.ts list
 *   npx tsx scripts/manage-user.ts reset-password --email admin@example.com --password newpass
 *   npx tsx scripts/manage-user.ts delete --email old@example.com
 *
 * Roles: superadmin, admin, viewer
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const VALID_ROLES = ['superadmin', 'admin', 'viewer'] as const

function parseArgs() {
  const args = process.argv.slice(2)
  const command = args[0]
  const flags: Record<string, string> = {}

  for (let i = 1; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '')
    const val = args[i + 1]
    if (key && val) flags[key] = val
  }

  return { command, flags }
}

async function getDefaultClient() {
  const slug = process.env.DEFAULT_CLIENT_SLUG || 'car-nation-bristol'
  const client = await prisma.client.findUnique({ where: { slug } })
  if (!client) {
    console.error(`Client "${slug}" not found. Run db:seed first.`)
    process.exit(1)
  }
  return client
}

async function createUser(flags: Record<string, string>) {
  const { email, password, name, role = 'admin' } = flags

  if (!email || !password || !name) {
    console.error('Required: --email, --password, --name')
    console.error('Optional: --role (superadmin|admin|viewer, default: admin)')
    process.exit(1)
  }

  if (!VALID_ROLES.includes(role as typeof VALID_ROLES[number])) {
    console.error(`Invalid role "${role}". Valid: ${VALID_ROLES.join(', ')}`)
    process.exit(1)
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.error(`User ${email} already exists.`)
    process.exit(1)
  }

  const client = await getDefaultClient()
  const hash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      clientId: client.id,
      email,
      passwordHash: hash,
      name,
      role,
    },
  })

  console.log(`Created user: ${user.email} (role: ${user.role}, id: ${user.id})`)
}

async function listUsers() {
  const users = await prisma.user.findMany({
    include: { client: true },
    orderBy: { createdAt: 'asc' },
  })

  if (users.length === 0) {
    console.log('No users found.')
    return
  }

  console.log('\n  ID                        Email                        Role          Client')
  console.log('  ' + '-'.repeat(90))
  for (const u of users) {
    console.log(
      `  ${u.id.padEnd(26)} ${u.email.padEnd(28)} ${u.role.padEnd(13)} ${u.client.name}`
    )
  }
  console.log(`\n  Total: ${users.length} user(s)\n`)
}

async function resetPassword(flags: Record<string, string>) {
  const { email, password } = flags

  if (!email || !password) {
    console.error('Required: --email, --password')
    process.exit(1)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error(`User ${email} not found.`)
    process.exit(1)
  }

  const hash = await bcrypt.hash(password, 12)
  await prisma.user.update({
    where: { email },
    data: { passwordHash: hash },
  })

  console.log(`Password reset for ${email}.`)
}

async function deleteUser(flags: Record<string, string>) {
  const { email } = flags

  if (!email) {
    console.error('Required: --email')
    process.exit(1)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error(`User ${email} not found.`)
    process.exit(1)
  }

  if (user.role === 'superadmin') {
    const superadminCount = await prisma.user.count({ where: { role: 'superadmin' } })
    if (superadminCount <= 1) {
      console.error('Cannot delete the last superadmin.')
      process.exit(1)
    }
  }

  await prisma.user.delete({ where: { email } })
  console.log(`Deleted user ${email}.`)
}

async function main() {
  const { command, flags } = parseArgs()

  switch (command) {
    case 'create':
      await createUser(flags)
      break
    case 'list':
      await listUsers()
      break
    case 'reset-password':
      await resetPassword(flags)
      break
    case 'delete':
      await deleteUser(flags)
      break
    default:
      console.log(`
garage-admin user management

Commands:
  create          Create a new user
  list            List all users
  reset-password  Reset a user's password
  delete          Delete a user

Examples:
  npx tsx scripts/manage-user.ts create --email admin@example.com --password secret --name "Admin" --role superadmin
  npx tsx scripts/manage-user.ts list
  npx tsx scripts/manage-user.ts reset-password --email admin@example.com --password newpass
  npx tsx scripts/manage-user.ts delete --email old@example.com

Roles: superadmin, admin, viewer
`)
      break
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
