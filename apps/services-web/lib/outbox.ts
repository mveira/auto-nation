/**
 * Outbox processor — processes pending GHL sync events with exponential backoff.
 */

import { prisma } from '@/lib/db';
import { syncLeadToGhl, type SyncResult } from '@/lib/ghl';

const MAX_ATTEMPTS = 5;
const BACKOFF_MS = [60_000, 300_000, 900_000, 3_600_000, 7_200_000]; // 1m, 5m, 15m, 1h, 2h

function getBackoff(attempt: number): number {
  return BACKOFF_MS[Math.min(attempt, BACKOFF_MS.length - 1)];
}

export async function processOutbox(): Promise<{ processed: number; failed: number }> {
  const events = await prisma.outboxEvent.findMany({
    where: {
      status: 'pending',
      nextRetryAt: { lte: new Date() },
    },
    orderBy: { createdAt: 'asc' },
    take: 50,
  });

  let processed = 0;
  let failed = 0;

  for (const event of events) {
    try {
      if (event.eventType === 'LeadCreated') {
        await handleLeadCreated(event.payload as Record<string, unknown>);
      }

      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: { status: 'processed', processedAt: new Date() },
      });
      processed++;
    } catch (err) {
      const newAttempts = event.attempts + 1;
      const newStatus = newAttempts >= MAX_ATTEMPTS ? 'failed' : 'pending';
      const nextRetry = newStatus === 'pending'
        ? new Date(Date.now() + getBackoff(newAttempts))
        : event.nextRetryAt;

      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: {
          attempts: newAttempts,
          status: newStatus,
          lastError: err instanceof Error ? err.message : String(err),
          nextRetryAt: nextRetry,
        },
      });

      console.error(`[outbox] Event ${event.id} failed (attempt ${newAttempts}):`, err);
      failed++;
    }
  }

  return { processed, failed };
}

async function handleLeadCreated(payload: Record<string, unknown>) {
  const leadId = payload.leadId as string;
  const clientId = payload.clientId as string;

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { motReport: true },
  });
  if (!lead) throw new Error(`Lead ${leadId} not found`);

  // Build MOT note for GHL
  let motNote: string | undefined;
  if (lead.motReport) {
    const mot = lead.motReport;
    motNote = [
      `DVSA MOT Summary — ${lead.vrm ?? 'N/A'}`,
      `Status: ${mot.status}`,
      mot.expiryDate ? `Expiry: ${mot.expiryDate}` : null,
      mot.lastTestDate ? `Last Test: ${mot.lastTestDate}` : null,
      mot.odometerAtLastTest != null ? `Odometer: ${mot.odometerAtLastTest} mi` : null,
      `Advisories: ${mot.advisoryCount} | Major: ${mot.majorCount} | Dangerous: ${mot.dangerousCount}`,
      mot.flags.length > 0 ? `Flags: ${mot.flags.join(', ')}` : null,
    ]
      .filter(Boolean)
      .join('\n');
  }

  const title = lead.type === 'booking'
    ? `Booking: ${lead.serviceName || 'Service'} — ${lead.vrm ?? 'N/A'}`
    : `Enquiry: ${lead.vrm ?? 'N/A'}`;

  const result: SyncResult = await syncLeadToGhl({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    vrm: lead.vrm ?? '',
    title,
    source: lead.type === 'booking' ? 'Website Booking' : 'Website Enquiry',
    motNote,
  });

  // Store GHL IDs back in DB
  await prisma.ghlLink.upsert({
    where: { leadId: lead.id },
    update: {
      ghlContactId: result.ghlContactId,
      ghlOpportunityId: result.ghlOpportunityId,
      syncStatus: 'synced',
      lastSyncedAt: new Date(),
    },
    create: {
      clientId,
      leadId: lead.id,
      ghlContactId: result.ghlContactId,
      ghlOpportunityId: result.ghlOpportunityId,
      syncStatus: 'synced',
      lastSyncedAt: new Date(),
    },
  });
}
