import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeVrm } from '@/lib/utils'
import { enqueueEvent } from '@/lib/outbox'
import { getDefaultStageKey } from '@/lib/pipelines'

// POST /api/intake/book
// Called by services-web after form submission. Saves lead + MOT report to DB.
// Protected by INTAKE_API_KEY to prevent unauthorized access.

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.INTAKE_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      clientSlug,
      name, email, phone,
      vrm, vehicle, service, preferredDate, notes,
      motSummary,
    } = body

    if (!name || !email || !phone) {
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
    // Create lead + MOT report in a transaction
    const lead = await prisma.lead.create({
      data: {
        clientId: client.id,
        type: 'booking',
        pipeline,
        stageKey: getDefaultStageKey(pipeline),
        name,
        email,
        phone,
        vrm: normalizedVrm,
        vehicle: vehicle || null,
        service: service || null,
        preferredDate: preferredDate || null,
        notes: notes || null,
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

    // Enqueue GHL sync event
    await enqueueEvent('LeadCreated', {
      leadId: lead.id,
      clientId: client.id,
      name,
      email,
      phone,
      vrm: normalizedVrm,
      type: 'booking',
      pipeline,
      stageKey: lead.stageKey,
      service,
    })

    console.log(`[Intake] Booking lead created: ${lead.id} (${normalizedVrm})`)

    return NextResponse.json({ leadId: lead.id, publicId: lead.publicId }, { status: 201 })
  } catch (err) {
    console.error('[Intake] Book error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
