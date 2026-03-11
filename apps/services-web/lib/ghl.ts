/**
 * GoHighLevel Private Integration API adapter.
 *
 * Uses GHL_PRIVATE_KEY (Private Integration token) for auth.
 * All functions are server-only — never import from client code.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';

function getHeaders(): Record<string, string> {
  const token = process.env.GHL_PRIVATE_KEY;
  if (!token) throw new Error('GHL_PRIVATE_KEY is not set');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  };
}

function getLocationId(): string {
  const id = process.env.GHL_LOCATION_ID;
  if (!id) throw new Error('GHL_LOCATION_ID is not set');
  return id;
}

// ── Types ──

export interface GhlContact {
  id: string;
  locationId: string;
  email?: string;
  phone?: string;
  name?: string;
}

export interface GhlOpportunity {
  id: string;
  contactId: string;
  pipelineId: string;
  pipelineStageId: string;
  name: string;
}

// ── Upsert Contact ──

export async function upsertContact(input: {
  name: string;
  email: string;
  phone: string;
  locationId?: string;
}): Promise<GhlContact> {
  const locationId = input.locationId || getLocationId();

  // Try to find existing contact by email first
  const searchRes = await fetch(
    `${GHL_BASE}/contacts/lookup?email=${encodeURIComponent(input.email)}&locationId=${locationId}`,
    { method: 'GET', headers: getHeaders() }
  );

  if (searchRes.ok) {
    const searchData = await searchRes.json();
    const existing = searchData?.contacts?.[0];
    if (existing?.id) {
      // Update existing contact
      const updateRes = await fetch(`${GHL_BASE}/contacts/${existing.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          name: input.name,
          phone: input.phone,
        }),
      });
      if (updateRes.ok) {
        const data = await updateRes.json();
        return data.contact ?? existing;
      }
      // If update fails, return existing unchanged
      return existing;
    }
  }

  // Create new contact
  const createRes = await fetch(`${GHL_BASE}/contacts/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      locationId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      source: 'Website Form',
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`GHL create contact failed (${createRes.status}): ${errText}`);
  }

  const data = await createRes.json();
  return data.contact;
}

// ── Create Opportunity ──

export async function createOpportunity(input: {
  contactId: string;
  pipelineId?: string;
  stageId?: string;
  title: string;
  source?: string;
}): Promise<GhlOpportunity> {
  const pipelineId = input.pipelineId || process.env.GHL_PIPELINE_ID;
  const stageId = input.stageId || process.env.GHL_STAGE_ID_NEW;

  if (!pipelineId) throw new Error('GHL_PIPELINE_ID is not set and no pipelineId provided');
  if (!stageId) throw new Error('GHL_STAGE_ID_NEW is not set and no stageId provided');

  const res = await fetch(`${GHL_BASE}/opportunities/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      pipelineId,
      pipelineStageId: stageId,
      contactId: input.contactId,
      name: input.title,
      source: input.source || 'Website',
      locationId: getLocationId(),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GHL create opportunity failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.opportunity;
}

// ── Update Opportunity Stage ──

export async function updateOpportunityStage(input: {
  opportunityId: string;
  stageId: string;
}): Promise<void> {
  const res = await fetch(`${GHL_BASE}/opportunities/${input.opportunityId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      pipelineStageId: input.stageId,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GHL update opportunity stage failed (${res.status}): ${errText}`);
  }
}

// ── Add Note to Opportunity ──

export async function addOpportunityNote(input: {
  opportunityId: string;
  body: string;
}): Promise<void> {
  const res = await fetch(`${GHL_BASE}/opportunities/${input.opportunityId}/notes`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ body: input.body }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GHL add note failed (${res.status}): ${errText}`);
  }
}

// ── Full sync: upsert contact → create opportunity → add DVSA note ──

export interface SyncResult {
  ghlContactId: string;
  ghlOpportunityId: string;
  pipelineId: string;
  stageId: string;
}

export async function syncLeadToGhl(input: {
  name: string;
  email: string;
  phone: string;
  vrm: string;
  title: string;
  source: string;
  motNote?: string;
}): Promise<SyncResult> {
  const contact = await upsertContact({
    name: input.name,
    email: input.email,
    phone: input.phone,
  });

  const pipelineId = process.env.GHL_PIPELINE_ID!;
  const stageId = process.env.GHL_STAGE_ID_NEW!;

  const opportunity = await createOpportunity({
    contactId: contact.id,
    pipelineId,
    stageId,
    title: input.title,
    source: input.source,
  });

  if (input.motNote) {
    await addOpportunityNote({
      opportunityId: opportunity.id,
      body: input.motNote,
    });
  }

  return {
    ghlContactId: contact.id,
    ghlOpportunityId: opportunity.id,
    pipelineId,
    stageId,
  };
}
