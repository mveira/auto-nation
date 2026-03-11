// ---------------------------------------------------------------------------
// Outbox pattern — reliable event delivery to GHL
// ---------------------------------------------------------------------------

import { prisma } from './prisma'
import {
  upsertContact,
  createOrUpdateOpportunity,
  moveOpportunityStage,
  getGhlPipelineId,
  getGhlStageId,
  type GhlContactPayload,
} from './ghl'

const MAX_ATTEMPTS = 5

interface LeadCreatedPayload {
  leadId: string
  clientId: string
  name: string
  email: string
  phone: string
  vrm?: string
  type: string
  pipeline: string
  stageKey: string
  service?: string
}

interface LeadStageChangedPayload {
  leadId: string
  clientId: string
  pipeline: string
  stageKey: string
}

export async function enqueueEvent(eventType: string, payload: Record<string, unknown>) {
  return prisma.outboxEvent.create({
    data: {
      eventType,
      payload: payload as object,
      status: 'pending',
    },
  })
}

export async function processPendingEvents() {
  const events = await prisma.outboxEvent.findMany({
    where: {
      status: 'pending',
      nextRetryAt: { lte: new Date() },
      attempts: { lt: MAX_ATTEMPTS },
    },
    orderBy: { createdAt: 'asc' },
    take: 20,
  })

  if (events.length === 0) return 0

  let processed = 0

  for (const event of events) {
    try {
      let success = false

      if (event.eventType === 'LeadCreated') {
        success = await handleLeadCreated(event.payload as unknown as LeadCreatedPayload)
      } else if (event.eventType === 'LeadStageChanged' || event.eventType === 'StageChanged') {
        success = await handleLeadStageChanged(event.payload as unknown as LeadStageChangedPayload)
      } else {
        console.warn(`[Outbox] Unknown event type: ${event.eventType}`)
        success = true
      }

      if (success) {
        await prisma.outboxEvent.update({
          where: { id: event.id },
          data: { status: 'processed', processedAt: new Date() },
        })
        processed++
      } else {
        throw new Error('GHL sync returned false')
      }
    } catch (err) {
      const nextAttempt = event.attempts + 1
      const backoffMs = Math.min(1000 * Math.pow(2, nextAttempt), 300_000)

      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: {
          attempts: nextAttempt,
          lastError: err instanceof Error ? err.message : String(err),
          nextRetryAt: new Date(Date.now() + backoffMs),
          status: nextAttempt >= MAX_ATTEMPTS ? 'failed' : 'pending',
        },
      })

      console.error(`[Outbox] Event ${event.id} failed (attempt ${nextAttempt}):`, err)
    }
  }

  return processed
}

// ── Event handlers ─────────────────────────────────────────────────────────

async function handleLeadCreated(payload: LeadCreatedPayload): Promise<boolean> {
  const locationId = process.env.GHL_LOCATION_ID
  const pipelineId = getGhlPipelineId(payload.pipeline)
  if (!locationId || !pipelineId) {
    console.warn('[Outbox] GHL_LOCATION_ID or pipeline ID not set — skipping')
    return true
  }

  const nameParts = payload.name.split(' ')
  const contactData: GhlContactPayload = {
    firstName: nameParts[0],
    lastName: nameParts.slice(1).join(' ') || undefined,
    email: payload.email,
    phone: payload.phone,
    tags: [payload.type, payload.pipeline.toLowerCase(), payload.vrm ?? 'no-vrm'].filter(Boolean),
  }

  const contactResult = await upsertContact(locationId, contactData)
  if (!contactResult) return false

  const ghlStageId = getGhlStageId(payload.stageKey) || ''
  const oppResult = await createOrUpdateOpportunity(locationId, {
    pipelineId,
    pipelineStageId: ghlStageId,
    contactId: contactResult.contactId,
    name: `${payload.type === 'booking' ? 'Booking' : 'Enquiry'}: ${payload.name}${payload.service ? ` — ${payload.service}` : ''}`,
  })
  if (!oppResult) return false

  await prisma.ghlLink.upsert({
    where: { leadId: payload.leadId },
    update: {
      ghlContactId: contactResult.contactId,
      ghlOpportunityId: oppResult.opportunityId,
      syncStatus: 'synced',
      lastSyncedAt: new Date(),
    },
    create: {
      clientId: payload.clientId,
      leadId: payload.leadId,
      ghlContactId: contactResult.contactId,
      ghlOpportunityId: oppResult.opportunityId,
      syncStatus: 'synced',
      lastSyncedAt: new Date(),
    },
  })

  return true
}

async function handleLeadStageChanged(payload: LeadStageChangedPayload): Promise<boolean> {
  const ghlLink = await prisma.ghlLink.findUnique({
    where: { leadId: payload.leadId },
  })

  if (!ghlLink?.ghlOpportunityId) {
    console.warn(`[Outbox] No GHL opportunity for lead ${payload.leadId} — skipping`)
    return true
  }

  const ghlStageId = getGhlStageId(payload.stageKey)
  if (!ghlStageId) {
    console.warn(`[Outbox] No GHL stage mapping for "${payload.stageKey}"`)
    return true
  }

  const moved = await moveOpportunityStage(ghlLink.ghlOpportunityId, ghlStageId)
  if (!moved) return false

  await prisma.ghlLink.update({
    where: { id: ghlLink.id },
    data: { syncStatus: 'synced', lastSyncedAt: new Date() },
  })

  return true
}
