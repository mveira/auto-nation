import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { enqueueEvent } from '@/lib/outbox'
import { isValidStageKey } from '@/lib/pipelines'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const lead = await prisma.lead.findFirst({
    where: { id, clientId: session.clientId },
    include: {
      motReport: true,
      ghlLink: true,
      payments: {
        include: { events: { orderBy: { createdAt: 'desc' } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!lead) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(lead)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { stageKey } = body

  if (!stageKey) {
    return NextResponse.json({ error: 'stageKey is required' }, { status: 400 })
  }

  const lead = await prisma.lead.findFirst({
    where: { id, clientId: session.clientId },
  })

  if (!lead) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (!isValidStageKey(lead.pipeline, stageKey)) {
    return NextResponse.json(
      { error: `Invalid stageKey "${stageKey}" for pipeline "${lead.pipeline}"` },
      { status: 400 },
    )
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: { stageKey },
    include: { motReport: true, ghlLink: true, payments: { include: { events: { orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' } } },
  })

  await enqueueEvent('LeadStageChanged', {
    leadId: id,
    clientId: session.clientId,
    pipeline: lead.pipeline,
    stageKey,
  })

  return NextResponse.json(updated)
}
