// ---------------------------------------------------------------------------
// GHL (GoHighLevel) Private Integration Adapter — server-only
// ---------------------------------------------------------------------------
//
// Supports dual pipelines via env vars:
//   GHL_PIPELINE_ID_SERVICES / GHL_PIPELINE_ID_SALES
//   GHL_STAGE_ID_<STAGE_KEY> (e.g. GHL_STAGE_ID_SERVICES_NEW)
// ---------------------------------------------------------------------------

const GHL_BASE = 'https://services.leadconnectorhq.com'

function getHeaders(): Record<string, string> {
  const token = process.env.GHL_PRIVATE_TOKEN
  if (!token) throw new Error('GHL_PRIVATE_TOKEN not set')
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28',
  }
}

// ── Pipeline + stage mapping ─────────────────────────────────────────────

export function getGhlPipelineId(pipeline: string): string | null {
  if (pipeline === 'SALES') {
    return process.env.GHL_PIPELINE_ID_SALES ?? process.env.GHL_PIPELINE_ID ?? null
  }
  return process.env.GHL_PIPELINE_ID_SERVICES ?? process.env.GHL_PIPELINE_ID ?? null
}

export function getGhlStageId(stageKey: string): string | null {
  return process.env[`GHL_STAGE_ID_${stageKey}`] ?? null
}

// ── Contacts ───────────────────────────────────────────────────────────────

export interface GhlContactPayload {
  firstName: string
  lastName?: string
  email: string
  phone: string
  tags?: string[]
  customField?: Record<string, string>
}

export async function upsertContact(
  locationId: string,
  data: GhlContactPayload,
): Promise<{ contactId: string } | null> {
  try {
    const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ locationId, ...data }),
    })

    if (!res.ok) {
      console.error(`[GHL] upsertContact failed: ${res.status}`, await res.text())
      return null
    }

    const json = await res.json()
    return { contactId: json.contact?.id ?? json.id }
  } catch (err) {
    console.error('[GHL] upsertContact error:', err)
    return null
  }
}

// ── Opportunities ──────────────────────────────────────────────────────────

export interface GhlOpportunityPayload {
  pipelineId: string
  pipelineStageId: string
  contactId: string
  name: string
  monetaryValue?: number
}

export async function createOrUpdateOpportunity(
  locationId: string,
  data: GhlOpportunityPayload,
  existingOpportunityId?: string,
): Promise<{ opportunityId: string } | null> {
  try {
    const url = existingOpportunityId
      ? `${GHL_BASE}/opportunities/${existingOpportunityId}`
      : `${GHL_BASE}/opportunities/`

    const method = existingOpportunityId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify({ locationId, ...data }),
    })

    if (!res.ok) {
      console.error(`[GHL] createOrUpdateOpportunity failed: ${res.status}`, await res.text())
      return null
    }

    const json = await res.json()
    return { opportunityId: json.opportunity?.id ?? json.id }
  } catch (err) {
    console.error('[GHL] createOrUpdateOpportunity error:', err)
    return null
  }
}

export async function moveOpportunityStage(
  opportunityId: string,
  pipelineStageId: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${GHL_BASE}/opportunities/${opportunityId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ pipelineStageId }),
    })

    if (!res.ok) {
      console.error(`[GHL] moveOpportunityStage failed: ${res.status}`, await res.text())
      return false
    }

    return true
  } catch (err) {
    console.error('[GHL] moveOpportunityStage error:', err)
    return false
  }
}
