'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.push('/board')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter">
            Garage <span className="text-brand">Admin</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Sign in to manage leads</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              className="w-full h-11 rounded-lg bg-zinc-800 border border-zinc-700 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              placeholder="admin@carnation.co.uk"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full h-11 rounded-lg bg-zinc-800 border border-zinc-700 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
              placeholder="********"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-brand text-black font-bold text-sm hover:bg-brand/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
