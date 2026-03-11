import { prisma } from '@/lib/db';
import { fetchMotSummary, normalizeVrm, type MotSummary } from '@/lib/dvsa';

// ── Default client lookup (cached) ──
const DEFAULT_CLIENT_SLUG = process.env.DEFAULT_CLIENT_SLUG || 'car-nation-bristol';
let _defaultClientId: string | null = null;

async function getDefaultClientId(): Promise<string> {
  if (_defaultClientId) return _defaultClientId;
  const client = await prisma.client.findUnique({
    where: { slug: DEFAULT_CLIENT_SLUG },
  });
  if (!client) throw new Error(`Default client "${DEFAULT_CLIENT_SLUG}" not found. Run db:seed first.`);
  _defaultClientId = client.id;
  return _defaultClientId;
}

// ── Input types ──

export interface BookingInput {
  name: string;
  email: string;
  phone: string;
  vrm: string;
  vehicle: string;
  service: string;
  preferredDate?: string | null;
  notes?: string | null;
}

export interface EnquiryInput {
  name: string;
  email: string;
  phone: string;
  vrm: string;
  message: string;
}

export interface IntakeResult {
  leadId: string;
  motSummary: MotSummary | null;
}

// ── Booking intake ──

export async function createLeadFromBooking(input: BookingInput): Promise<IntakeResult> {
  const normalizedVrm = normalizeVrm(input.vrm);
  const clientId = await getDefaultClientId();

  // DVSA enrichment — best effort, never blocks lead capture
  let motSummary: MotSummary | null = null;
  try {
    motSummary = await fetchMotSummary(normalizedVrm);
  } catch (err) {
    console.error('[intake] DVSA enrichment failed (booking):', err);
  }

  // Transactional write: Lead + MotReport + OutboxEvent
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lead = await prisma.$transaction(async (tx: any) => {
    const lead = await tx.lead.create({
      data: {
        clientId,
        type: 'booking',
        pipeline: 'SERVICES',
        stageKey: 'SERVICES_BOOKED',
        name: input.name,
        email: input.email,
        phone: input.phone,
        vrm: normalizedVrm,
        vehicle: input.vehicle || null,
        service: input.service.toLowerCase().replace(/\s+/g, '-'),
        serviceName: input.service,
        preferredDate: input.preferredDate || null,
        notes: input.notes || null,
      },
    });

    if (motSummary) {
      await tx.motReport.create({
        data: {
          leadId: lead.id,
          vrm: normalizedVrm,
          status: motSummary.status,
          expiryDate: motSummary.expiryDate || null,
          lastTestDate: motSummary.lastTestDate || null,
          odometerAtLastTest: motSummary.odometerAtLastTest ?? null,
          advisoryCount: motSummary.advisoryCount,
          majorCount: motSummary.majorCount,
          dangerousCount: motSummary.dangerousCount,
          flags: motSummary.flags,
        },
      });
    }

    await tx.outboxEvent.create({
      data: {
        eventType: 'LeadCreated',
        payload: {
          leadId: lead.id,
          clientId,
          type: 'booking',
          vrm: normalizedVrm,
          hasMotData: !!motSummary,
        },
      },
    });

    return lead;
  });

  return { leadId: lead.id, motSummary };
}

// ── Enquiry intake ──

export async function createLeadFromEnquiry(input: EnquiryInput): Promise<IntakeResult> {
  const normalizedVrm = normalizeVrm(input.vrm);
  const clientId = await getDefaultClientId();

  // DVSA enrichment — best effort
  let motSummary: MotSummary | null = null;
  try {
    motSummary = await fetchMotSummary(normalizedVrm);
  } catch (err) {
    console.error('[intake] DVSA enrichment failed (enquiry):', err);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lead = await prisma.$transaction(async (tx: any) => {
    const lead = await tx.lead.create({
      data: {
        clientId,
        type: 'enquiry',
        pipeline: 'SERVICES',
        stageKey: 'SERVICES_NEW_ENQUIRY',
        name: input.name,
        email: input.email,
        phone: input.phone,
        vrm: normalizedVrm,
        message: input.message,
      },
    });

    if (motSummary) {
      await tx.motReport.create({
        data: {
          leadId: lead.id,
          vrm: normalizedVrm,
          status: motSummary.status,
          expiryDate: motSummary.expiryDate || null,
          lastTestDate: motSummary.lastTestDate || null,
          odometerAtLastTest: motSummary.odometerAtLastTest ?? null,
          advisoryCount: motSummary.advisoryCount,
          majorCount: motSummary.majorCount,
          dangerousCount: motSummary.dangerousCount,
          flags: motSummary.flags,
        },
      });
    }

    await tx.outboxEvent.create({
      data: {
        eventType: 'LeadCreated',
        payload: {
          leadId: lead.id,
          clientId,
          type: 'enquiry',
          vrm: normalizedVrm,
          hasMotData: !!motSummary,
        },
      },
    });

    return lead;
  });

  return { leadId: lead.id, motSummary };
}
