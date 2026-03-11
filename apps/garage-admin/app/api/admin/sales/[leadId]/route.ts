import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { enqueueEvent } from '@/lib/outbox'

// POST /api/admin/sales/:leadId  { action: "deposit-link" | "mark-paid", ... }

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { leadId } = await params
  const body = await request.json()
  const { action } = body

  // Verify lead belongs to this client and is a SALES lead
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, clientId: session.clientId, pipeline: 'SALES' },
  })
  if (!lead) {
    return NextResponse.json({ error: 'Sales lead not found' }, { status: 404 })
  }

  if (action === 'deposit-link') {
    return handleDepositLink(lead, body, session.clientId)
  }

  if (action === 'mark-paid') {
    return handleMarkPaid(lead, body, session.clientId)
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

// GET /api/admin/sales/:leadId  — fetch payments for a lead
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { leadId } = await params
  const payments = await prisma.salesPayment.findMany({
    where: { leadId, lead: { clientId: session.clientId } },
    include: { events: { orderBy: { createdAt: 'desc' } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ payments })
}

// ─── deposit-link ───────────────────────────────────────────────────────────

async function handleDepositLink(
  lead: { id: string; name: string; email: string; phone: string },
  body: { amountPence: number; method?: string },
  clientId: string,
) {
  const { amountPence, method } = body

  if (!amountPence || amountPence <= 0) {
    return NextResponse.json({ error: 'amountPence is required and must be > 0' }, { status: 400 })
  }

  // Check no existing pending deposit
  const existing = await prisma.salesPayment.findFirst({
    where: { leadId: lead.id, type: 'DEPOSIT', status: 'PENDING' },
  })
  if (existing) {
    return NextResponse.json({ error: 'A pending deposit already exists', existingId: existing.id }, { status: 409 })
  }

  const paymentMethod = method || 'ONLINE_LINK'

  const payment = await prisma.salesPayment.create({
    data: {
      leadId: lead.id,
      type: 'DEPOSIT',
      method: paymentMethod,
      amountPence,
      status: 'PENDING',
      provider: paymentMethod === 'ONLINE_LINK' ? 'STRIPE' : 'NONE',
      events: {
        create: { eventType: 'CREATED' },
      },
    },
    include: { events: true },
  })

  // If ONLINE_LINK, enqueue an event so the outbox processor can generate a Stripe checkout link
  if (paymentMethod === 'ONLINE_LINK') {
    await enqueueEvent('PaymentLinkRequested', {
      paymentId: payment.id,
      leadId: lead.id,
      clientId,
      amountPence,
      customerName: lead.name,
      customerEmail: lead.email,
    })
  }

  return NextResponse.json({ payment }, { status: 201 })
}

// ─── mark-paid ──────────────────────────────────────────────────────────────

async function handleMarkPaid(
  lead: { id: string },
  body: { paymentId?: string; type?: string; amountPence?: number; method?: string },
  clientId: string,
) {
  let paymentId = body.paymentId

  // If no paymentId, create one on the fly (manual mark-as-paid without prior link)
  if (!paymentId) {
    const amountPence = body.amountPence
    if (!amountPence || amountPence <= 0) {
      return NextResponse.json({ error: 'amountPence is required when no paymentId' }, { status: 400 })
    }

    const payment = await prisma.salesPayment.create({
      data: {
        leadId: lead.id,
        type: body.type || 'DEPOSIT',
        method: body.method || 'MANUAL',
        amountPence,
        status: 'PAID',
        paidAt: new Date(),
        events: {
          create: { eventType: 'MARKED_PAID' },
        },
      },
      include: { events: true },
    })

    await enqueueEvent('PaymentMarkedPaid', {
      paymentId: payment.id,
      leadId: lead.id,
      clientId,
      amountPence,
      type: payment.type,
    })

    return NextResponse.json({ payment })
  }

  // Mark existing payment as paid
  const payment = await prisma.salesPayment.findFirst({
    where: { id: paymentId, leadId: lead.id },
  })
  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }
  if (payment.status === 'PAID') {
    return NextResponse.json({ error: 'Already paid' }, { status: 409 })
  }

  const updated = await prisma.salesPayment.update({
    where: { id: paymentId },
    data: {
      status: 'PAID',
      paidAt: new Date(),
      events: {
        create: { eventType: 'MARKED_PAID' },
      },
    },
    include: { events: true },
  })

  await enqueueEvent('PaymentMarkedPaid', {
    paymentId,
    leadId: lead.id,
    clientId,
    amountPence: updated.amountPence,
    type: updated.type,
  })

  return NextResponse.json({ payment: updated })
}
