'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import type { LeadData } from './LeadCard'

interface CreateLeadModalProps {
  pipeline: string
  onClose: () => void
  onCreated: (lead: LeadData) => void
}

export function CreateLeadModal({ pipeline, onClose, onCreated }: CreateLeadModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      vrm: (form.elements.namedItem('vrm') as HTMLInputElement).value,
      vehicle: (form.elements.namedItem('vehicle') as HTMLInputElement).value,
      service: (form.elements.namedItem('service') as HTMLInputElement).value,
      type: (form.elements.namedItem('type') as HTMLSelectElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      notes: (form.elements.namedItem('notes') as HTMLTextAreaElement).value,
      pipeline,
    }

    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || 'Failed to create lead')
      }

      const lead = await res.json()
      onCreated(lead)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold">
            Create Lead
            <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded bg-brand/20 text-brand">
              {pipeline}
            </span>
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded">{error}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Name *</label>
              <input name="name" required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Email</label>
              <input name="email" type="email" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Phone</label>
              <input name="phone" type="tel" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">VRM</label>
              <input
                name="vrm"
                placeholder="e.g. AB12 CDE"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:border-brand"
                onChange={(e) => { e.target.value = e.target.value.toUpperCase() }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Vehicle</label>
              <input name="vehicle" placeholder="e.g. Ford Focus 2019" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Type</label>
              <select name="type" defaultValue="booking" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand">
                <option value="booking">Booking</option>
                <option value="enquiry">Enquiry</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Service</label>
              <input name="service" placeholder="e.g. MOT, Full Service" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Message</label>
              <textarea name="message" rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Notes</label>
              <textarea name="notes" rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand resize-none" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold bg-brand text-black rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
