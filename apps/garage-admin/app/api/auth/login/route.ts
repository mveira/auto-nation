import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const session = await createSession(email, password)
    if (!session) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    return NextResponse.json({ ok: true, user: { email: session.email, role: session.role } })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
