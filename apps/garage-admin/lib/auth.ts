import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me')
const COOKIE_NAME = 'ga_session'
const TOKEN_TTL = '8h'

export interface SessionPayload {
  userId: string
  clientId: string
  email: string
  role: string
}

export async function createSession(email: string, password: string): Promise<SessionPayload | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { client: true },
  })
  if (!user) return null

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return null

  const payload: SessionPayload = {
    userId: user.id,
    clientId: user.clientId,
    email: user.email,
    role: user.role,
  }

  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TOKEN_TTL)
    .setIssuedAt()
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  return payload
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/** Verify a session token string (for middleware — no cookie access). */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
