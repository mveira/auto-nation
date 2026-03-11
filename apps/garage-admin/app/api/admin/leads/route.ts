import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normalizeVrm } from '@/lib/utils'
import { enqueueEvent } from '@/lib/outbox'
import { PIPELINE_IDS, getDefaultStageKey } from '@/lib/pipelines'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, email, phone, vrm, vehicle, service, preferredDate, message, notes, type, pipeline } = body

    if (!name && !phone && !email) {
      return NextResponse.json({ error: 'Name or phone/email is required' }, { status: 400 })
    }

    const leadType = type === 'enquiry' ? 'enquiry' : 'booking'
    const leadPipeline = PIPELINE_IDS.includes(pipeline) ? pipeline : 'SERVICES'
    const normalizedVrm = vrm ? normalizeVrm(vrm) : null

    const lead = await prisma.lead.create({
      data: {
        clientId: session.clientId,
        type: leadType,
        pipeline: leadPipeline,
        stageKey: getDefaultStageKey(leadPipeline),
        name: name || 'Unknown',
        email: email || '',
        phone: phone || '',
        vrm: normalizedVrm,
        vehicle: vehicle || null,
        service: service || null,
        preferredDate: preferredDate || null,
        message: message || null,
        notes: notes || null,
      },
      include: { motReport: true, ghlLink: true },
    })

    await enqueueEvent('LeadCreated', {
      leadId: lead.id,
      clientId: session.clientId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      vrm: normalizedVrm,
      type: leadType,
      pipeline: leadPipeline,
      stageKey: lead.stageKey,
      service: service || undefined,
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (err) {
    console.error('[API] Create lead error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
