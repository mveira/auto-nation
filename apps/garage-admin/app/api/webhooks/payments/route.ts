import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { enqueueEvent } from '@/lib/outbox'

// POST /api/webhooks/payments
// Called by Stripe (or other provider) when a payment status changes.
// Protected by webhook secret header.

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret')
  if (!secret || secret !== process.env.PAYMENT_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { paymentId, status, providerPaymentId, rawEvent } = body

    if (!paymentId || !status) {
      return NextResponse.json({ error: 'paymentId and status are required' }, { status: 400 })
    }

    const payment = await prisma.salesPayment.findUnique({ where: { id: paymentId } })
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Idempotency: if already in terminal state, skip
    if (payment.status === 'PAID' || payment.status === 'REFUNDED') {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const eventType = status === 'PAID' ? 'PAID' : status === 'FAILED' ? 'FAILED' : status
    const paidAt = status === 'PAID' ? new Date() : undefined

    const updated = await prisma.salesPayment.update({
      where: { id: paymentId },
      data: {
        status,
        ...(providerPaymentId ? { providerPaymentId } : {}),
        ...(paidAt ? { paidAt } : {}),
        events: {
          create: {
            eventType,
            rawJson: rawEvent || null,
          },
        },
      },
    })

    // If paid, enqueue outbox event for GHL sync
    if (status === 'PAID') {
      await enqueueEvent('PaymentConfirmed', {
        paymentId,
        leadId: payment.leadId,
        amountPence: payment.amountPence,
        type: payment.type,
      })
    }

    console.log(`[Webhook] Payment ${paymentId} updated to ${status}`)
    return NextResponse.json({ ok: true, payment: updated })
  } catch (err) {
    console.error('[Webhook] Payment error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
