import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeVrm } from '@/lib/utils'
import { enqueueEvent } from '@/lib/outbox'
import { getDefaultStageKey } from '@/lib/pipelines'

// POST /api/intake/enquiry
// Called by services-web after contact form submission.

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.INTAKE_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { clientSlug, name, email, phone, vrm, message, motSummary } = body

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Resolve client
    const slug = clientSlug || process.env.DEFAULT_CLIENT_SLUG || 'car-nation-bristol'
    const client = await prisma.client.findUnique({ where: { slug } })
    if (!client) {
      return NextResponse.json({ error: 'Unknown client' }, { status: 400 })
    }

    const normalizedVrm = vrm ? normalizeVrm(vrm) : null

    const pipeline = 'SERVICES'
    const lead = await prisma.lead.create({
      data: {
        clientId: client.id,
        type: 'enquiry',
        pipeline,
        stageKey: getDefaultStageKey(pipeline),
        name,
        email,
        phone,
        vrm: normalizedVrm,
        message,
        ...(motSummary && normalizedVrm
          ? {
              motReport: {
                create: {
                  vrm: normalizedVrm,
                  status: motSummary.status,
                  expiryDate: motSummary.expiryDate || null,
                  lastTestDate: motSummary.lastTestDate || null,
                  odometerAtLastTest: motSummary.odometerAtLastTest ?? null,
                  advisoryCount: motSummary.advisoryCount ?? 0,
                  majorCount: motSummary.majorCount ?? 0,
                  dangerousCount: motSummary.dangerousCount ?? 0,
                  flags: motSummary.flags ?? [],
                },
              },
            }
          : {}),
      },
    })

    await enqueueEvent('LeadCreated', {
      leadId: lead.id,
      clientId: client.id,
      name,
      email,
      phone,
      vrm: normalizedVrm,
      type: 'enquiry',
      pipeline,
      stageKey: lead.stageKey,
    })

    console.log(`[Intake] Enquiry lead created: ${lead.id} (${normalizedVrm})`)

    return NextResponse.json({ leadId: lead.id, publicId: lead.publicId }, { status: 201 })
  } catch (err) {
    console.error('[Intake] Enquiry error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
