'use client'

import { useState } from 'react'
import { Phone, Mail, Car, Clock, Wrench, AlertTriangle, ChevronDown } from 'lucide-react'
import type { StageConfig } from '@/lib/pipelines'

export interface LeadData {
  id: string
  publicId: string
  type: string
  pipeline: string
  stageKey: string
  name: string
  email: string
  phone: string
  vrm: string | null
  vehicle: string | null
  service: string | null
  message: string | null
  preferredDate: string | null
  notes: string | null
  createdAt: string
  motReport: {
    status: string
    expiryDate: string | null
    lastTestDate: string | null
    odometerAtLastTest: number | null
    advisoryCount: number
    majorCount: number
    dangerousCount: number
    flags: string[]
  } | null
  ghlLink: {
    syncStatus: string
  } | null
  payments?: SalesPaymentData[]
}

export interface SalesPaymentData {
  id: string
  type: string
  method: string
  amountPence: number
  currency: string
  status: string
  provider: string
  providerCheckoutUrl: string | null
  paidAt: string | null
  createdAt: string
  events: { id: string; eventType: string; createdAt: string }[]
}

interface LeadCardProps {
  lead: LeadData
  stages: StageConfig[]
  onClick: (lead: LeadData) => void
  onMove: (leadId: string, newStageKey: string) => void
}

export function LeadCard({ lead, stages, onClick, onMove }: LeadCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isBooking = lead.type === 'booking'
  const hasMotWarnings = lead.motReport && (
    lead.motReport.dangerousCount > 0 ||
    lead.motReport.majorCount > 0 ||
    lead.motReport.flags.some(f => f.includes('EXPIRED') || f.includes('FAILED'))
  )

  return (
    <div className="relative">
      <button
        onClick={() => onClick(lead)}
        className="w-full text-left bg-zinc-800 rounded-lg p-3 hover:bg-zinc-750 hover:ring-1 hover:ring-brand/30 transition-all cursor-pointer"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-semibold text-sm truncate">{lead.name}</p>
          <span className={`shrink-0 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isBooking ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
            {lead.type}
          </span>
        </div>

        {lead.vrm && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <Car className="h-3 w-3" />
            <span className="font-mono font-bold">{lead.vrm}</span>
            {lead.vehicle && <span className="truncate">- {lead.vehicle}</span>}
          </div>
        )}

        {lead.service && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <Wrench className="h-3 w-3" />
            <span className="truncate">{lead.service}</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-zinc-500 mt-2">
          {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>}
          {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email.split('@')[0]}</span>}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="flex items-center gap-1 text-[10px] text-zinc-500">
            <Clock className="h-3 w-3" />
            {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
          </span>

          <div className="flex items-center gap-1.5">
            {hasMotWarnings && (
              <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
                <AlertTriangle className="h-3 w-3" />
                MOT
              </span>
            )}
            {lead.ghlLink && (
              <span className={`text-[10px] px-1 py-0.5 rounded ${lead.ghlLink.syncStatus === 'synced' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                GHL
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Move dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="p-1 rounded hover:bg-zinc-700 transition-colors text-zinc-500 hover:text-zinc-300"
          title="Move to stage"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-7 z-30 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-1 min-w-[180px]">
              {stages.filter(s => s.key !== lead.stageKey).map((stage) => (
                <button
                  key={stage.key}
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen(false)
                    onMove(lead.id, stage.key)
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-800 transition-colors text-zinc-300 flex items-center gap-2"
                >
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  {stage.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
