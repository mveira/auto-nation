import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me')
const COOKIE_NAME = 'ga_session'

const protectedPaths = ['/board', '/api/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await jwtVerify(token, JWT_SECRET)
    return NextResponse.next()
  } catch {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/board/:path*', '/api/admin/:path*'],
}
