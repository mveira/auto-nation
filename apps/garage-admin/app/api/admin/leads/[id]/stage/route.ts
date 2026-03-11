import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { enqueueEvent } from '@/lib/outbox'
import { isValidStageKey } from '@/lib/pipelines'

// Legacy stage endpoint — kept for backwards compat.
// Prefer PATCH /api/admin/leads/:id with { stageKey }.

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { stage: stageKey } = await request.json()

  const lead = await prisma.lead.findFirst({
    where: { id, clientId: session.clientId },
  })

  if (!lead) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (!stageKey || !isValidStageKey(lead.pipeline, stageKey)) {
    return NextResponse.json(
      { error: `Invalid stage key "${stageKey}" for pipeline "${lead.pipeline}"` },
      { status: 400 },
    )
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: { stageKey },
  })

  await enqueueEvent('LeadStageChanged', {
    leadId: id,
    clientId: session.clientId,
    pipeline: lead.pipeline,
    stageKey,
  })

  return NextResponse.json({ id: updated.id, stageKey: updated.stageKey })
}
