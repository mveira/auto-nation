'use client'

import { useState } from 'react'
import { X, Phone, Mail, Car, Calendar, FileText, AlertTriangle, CheckCircle, XCircle, CreditCard, ExternalLink, Loader2, PoundSterling } from 'lucide-react'
import type { LeadData, SalesPaymentData } from './LeadCard'

interface LeadDetailProps {
  lead: LeadData
  onClose: () => void
  onPaymentUpdate?: () => void
}

export function LeadDetail({ lead, onClose, onPaymentUpdate }: LeadDetailProps) {
  const mot = lead.motReport
  const isSales = lead.pipeline === 'SALES'

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
          <h2 className="font-bold text-lg">{lead.name}</h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Contact */}
          <section>
            <h3 className="text-xs font-bold uppercase text-zinc-500 mb-2">Contact</h3>
            <div className="space-y-2 text-sm">
              <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-zinc-300 hover:text-brand">
                <Phone className="h-4 w-4" />{lead.phone}
              </a>
              <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-zinc-300 hover:text-brand">
                <Mail className="h-4 w-4" />{lead.email}
              </a>
            </div>
          </section>

          {/* Vehicle */}
          {lead.vrm && (
            <section>
              <h3 className="text-xs font-bold uppercase text-zinc-500 mb-2">Vehicle</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-brand" />
                  <span className="font-mono font-bold text-brand">{lead.vrm}</span>
                </div>
                {lead.vehicle && <p className="text-zinc-400 ml-6">{lead.vehicle}</p>}
              </div>
            </section>
          )}

          {/* Booking / Enquiry details */}
          <section>
            <h3 className="text-xs font-bold uppercase text-zinc-500 mb-2">
              {lead.type === 'booking' ? 'Booking' : 'Enquiry'}
            </h3>
            <div className="space-y-1 text-sm text-zinc-300">
              {lead.service && (
                <p className="flex items-center gap-2"><FileText className="h-4 w-4" />{lead.service}</p>
              )}
              {lead.preferredDate && (
                <p className="flex items-center gap-2"><Calendar className="h-4 w-4" />{lead.preferredDate}</p>
              )}
              {lead.notes && (
                <div className="mt-2 p-3 bg-zinc-800 rounded-lg text-xs">{lead.notes}</div>
              )}
              {lead.message && (
                <div className="mt-2 p-3 bg-zinc-800 rounded-lg text-xs">{lead.message}</div>
              )}
            </div>
          </section>

          {/* Sales Payments */}
          {isSales && (
            <PaymentsPanel
              leadId={lead.id}
              payments={lead.payments || []}
              onUpdate={onPaymentUpdate}
            />
          )}

          {/* MOT Summary */}
          {mot && (
            <section>
              <h3 className="text-xs font-bold uppercase text-zinc-500 mb-2">MOT Summary (DVSA)</h3>
              <div className="bg-zinc-800 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {mot.status === 'PASS' ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : mot.status === 'FAILED' ? (
                    <XCircle className="h-4 w-4 text-red-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  )}
                  <span className="font-bold">{mot.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                  {mot.expiryDate && <div>Expiry: <span className="text-zinc-200">{mot.expiryDate}</span></div>}
                  {mot.lastTestDate && <div>Last test: <span className="text-zinc-200">{mot.lastTestDate}</span></div>}
                </div>

                <div className="flex gap-3 text-xs">
                  <span className="text-yellow-400">Advisories: {mot.advisoryCount}</span>
                  <span className="text-orange-400">Major: {mot.majorCount}</span>
                  <span className="text-red-400">Dangerous: {mot.dangerousCount}</span>
                </div>

                {mot.flags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mot.flags.map((flag, i) => (
                      <span key={i} className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-medium">
                        {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Meta */}
          <section className="text-xs text-zinc-500 border-t border-zinc-800 pt-3 space-y-1">
            <p>Lead ID: {lead.id}</p>
            <p>Public ID: {lead.publicId}</p>
            <p>Created: {new Date(lead.createdAt).toLocaleString('en-GB')}</p>
            {lead.ghlLink && <p>GHL sync: {lead.ghlLink.syncStatus}</p>}
          </section>
        </div>
      </div>
    </div>
  )
}

// ─── Payments Panel ─────────────────────────────────────────────────────────

function PaymentsPanel({
  leadId,
  payments,
  onUpdate,
}: {
  leadId: string
  payments: SalesPaymentData[]
  onUpdate?: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<'deposit-link' | 'mark-paid'>('deposit-link')
  const [amount, setAmount] = useState('')
  const [paymentType, setPaymentType] = useState<'DEPOSIT' | 'BALANCE'>('DEPOSIT')
  const [method, setMethod] = useState('MANUAL')
  const [submitting, setSubmitting] = useState(false)

  const deposit = payments.find(p => p.type === 'DEPOSIT')
  const balance = payments.find(p => p.type === 'BALANCE')

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const amountPence = Math.round(parseFloat(amount) * 100)
      if (isNaN(amountPence) || amountPence <= 0) return

      const res = await fetch(`/api/admin/sales/${leadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: formType,
          amountPence,
          type: paymentType,
          method: formType === 'deposit-link' ? 'ONLINE_LINK' : method,
        }),
      })

      if (res.ok) {
        setShowForm(false)
        setAmount('')
        onUpdate?.()
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleMarkExistingPaid(paymentId: string) {
    const res = await fetch(`/api/admin/sales/${leadId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark-paid', paymentId }),
    })
    if (res.ok) onUpdate?.()
  }

  return (
    <section>
      <h3 className="text-xs font-bold uppercase text-zinc-500 mb-2">Payments</h3>
      <div className="space-y-2">
        {/* Existing payments */}
        {payments.length === 0 && !showForm && (
          <p className="text-xs text-zinc-500">No payments recorded yet.</p>
        )}

        {payments.map((p) => (
          <PaymentCard key={p.id} payment={p} onMarkPaid={() => handleMarkExistingPaid(p.id)} />
        ))}

        {/* Actions */}
        {!showForm && (
          <div className="flex gap-2 mt-2">
            {!deposit && (
              <button
                onClick={() => { setShowForm(true); setFormType('deposit-link'); setPaymentType('DEPOSIT') }}
                className="flex items-center gap-1.5 text-xs bg-brand text-black font-semibold px-3 py-1.5 rounded-lg hover:bg-brand/90 transition-colors"
              >
                <CreditCard className="h-3.5 w-3.5" />
                Send Deposit Link
              </button>
            )}
            <button
              onClick={() => { setShowForm(true); setFormType('mark-paid'); setPaymentType(deposit ? 'BALANCE' : 'DEPOSIT') }}
              className="flex items-center gap-1.5 text-xs border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <PoundSterling className="h-3.5 w-3.5" />
              Record Payment
            </button>
          </div>
        )}

        {/* New payment form */}
        {showForm && (
          <div className="bg-zinc-800 rounded-lg p-3 space-y-3">
            <p className="text-xs font-semibold text-zinc-300">
              {formType === 'deposit-link' ? 'Send Payment Link' : 'Record Manual Payment'}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setPaymentType('DEPOSIT')}
                className={`text-xs px-2.5 py-1 rounded ${paymentType === 'DEPOSIT' ? 'bg-brand text-black font-bold' : 'bg-zinc-700 text-zinc-400'}`}
              >
                Deposit
              </button>
              <button
                onClick={() => setPaymentType('BALANCE')}
                className={`text-xs px-2.5 py-1 rounded ${paymentType === 'BALANCE' ? 'bg-brand text-black font-bold' : 'bg-zinc-700 text-zinc-400'}`}
              >
                Balance
              </button>
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 uppercase">Amount (£)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 500.00"
                className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600"
              />
            </div>

            {formType === 'mark-paid' && (
              <div>
                <label className="text-[10px] text-zinc-500 uppercase">Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-200"
                >
                  <option value="MANUAL">Manual / Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CARD_TERMINAL">Card Terminal</option>
                </select>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={submitting || !amount}
                className="flex items-center gap-1.5 text-xs bg-brand text-black font-semibold px-3 py-1.5 rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                {formType === 'deposit-link' ? 'Send Link' : 'Mark as Paid'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="text-xs text-zinc-400 hover:text-white px-3 py-1.5"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Payment Card ───────────────────────────────────────────────────────────

function PaymentCard({ payment, onMarkPaid }: { payment: SalesPaymentData; onMarkPaid: () => void }) {
  const isPaid = payment.status === 'PAID'
  const isPending = payment.status === 'PENDING'
  const amountStr = `£${(payment.amountPence / 100).toFixed(2)}`

  return (
    <div className="bg-zinc-800 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase px-1.5 py-0.5 rounded ${
            payment.type === 'DEPOSIT' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
          }`}>
            {payment.type}
          </span>
          <span className="text-sm font-bold">{amountStr}</span>
        </div>
        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
          isPaid ? 'bg-green-500/20 text-green-400' :
          isPending ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {payment.status}
        </span>
      </div>

      <div className="text-[10px] text-zinc-500 space-y-0.5">
        <p>Method: {payment.method.replace(/_/g, ' ')}</p>
        {payment.paidAt && <p>Paid: {new Date(payment.paidAt).toLocaleString('en-GB')}</p>}
        <p>Created: {new Date(payment.createdAt).toLocaleString('en-GB')}</p>
      </div>

      {/* Actions for pending payments */}
      {isPending && (
        <div className="flex gap-2 mt-2">
          {payment.providerCheckoutUrl && (
            <a
              href={payment.providerCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-brand hover:underline"
            >
              <ExternalLink className="h-3 w-3" /> Payment Link
            </a>
          )}
          <button
            onClick={onMarkPaid}
            className="text-[10px] text-green-400 hover:text-green-300 font-semibold"
          >
            Mark as Paid
          </button>
        </div>
      )}

      {/* Event timeline */}
      {payment.events.length > 0 && (
        <div className="mt-2 pt-2 border-t border-zinc-700 space-y-1">
          {payment.events.map((e) => (
            <div key={e.id} className="flex items-center justify-between text-[10px] text-zinc-500">
              <span>{e.eventType.replace(/_/g, ' ')}</span>
              <span>{new Date(e.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
