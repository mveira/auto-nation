// ---------------------------------------------------------------------------
// DVSA MOT History API — server-side only
// ---------------------------------------------------------------------------
//
// ARCHITECTURE NOTES (teaching)
//
// WHY server-side API routes for DVSA:
//   DVSA credentials (client_id, client_secret, API key) are secrets that must
//   never reach the browser. Next.js API routes run exclusively on the server,
//   so importing this module from a route.ts is safe. Importing from a "use client"
//   component would leak secrets into the client bundle.
//
// WHY best-effort enrichment:
//   The DVSA API may be down, rate-limited, or the VRM may not have MOT history
//   (e.g. new vehicles < 3 years old). Lead capture must NEVER fail because of
//   an enrichment step. We return null on any failure and let the caller proceed.
//
// WHY token caching:
//   The DVSA Trade API uses OAuth2 client_credentials. Tokens are valid for ~5 min.
//   Re-authenticating on every request wastes time and risks hitting rate limits.
//   A simple in-memory cache with TTL avoids this. In a multi-instance deployment
//   (e.g. serverless), each cold start gets its own token — acceptable at our scale.
//
// HOW this supports later Option 2 hybrid architecture (DB + GHL + dashboard):
//   fetchMotSummary returns a clean MotSummary object (not the raw DVSA payload).
//   When we add a DB + dashboard later, we store this same object. The GHL webhook
//   can also receive it. The function signature stays the same — only the callers
//   change (API route -> also DB write + GHL push).
// ---------------------------------------------------------------------------

import { normalizeVrm } from './dvla'

// Re-export so callers can import from either module
export { normalizeVrm }

// ── Types ──────────────────────────────────────────────────────────────────

export interface MotSummary {
  /** Overall MOT status: "PASS", "FAIL", or "NO_RESULTS" */
  status: string
  /** MOT expiry date (ISO string, e.g. "2025-06-15") */
  expiryDate: string | null
  /** Date of last MOT test (ISO string) */
  lastTestDate: string | null
  /** Odometer reading at last test (miles) */
  odometerAtLastTest: number | null
  /** Count of advisory items from last test */
  advisoryCount: number
  /** Count of major faults from last test */
  majorCount: number
  /** Count of dangerous faults from last test */
  dangerousCount: number
  /** Human-readable flags for quick garage triage */
  flags: string[]
}

// ── OAuth2 token cache ─────────────────────────────────────────────────────

interface CachedToken {
  accessToken: string
  expiresAt: number // epoch ms
}

let tokenCache: CachedToken | null = null

/**
 * Obtain an OAuth2 access token via client_credentials grant.
 * Returns null if OAuth env vars are not configured (falls back to API-key-only).
 */
async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.DVSA_CLIENT_ID
  const clientSecret = process.env.DVSA_CLIENT_SECRET
  const tokenUrl = process.env.DVSA_TOKEN_URL
  const scope = process.env.DVSA_SCOPE

  // If OAuth vars aren't set, skip — caller will use API key only
  if (!clientId || !clientSecret || !tokenUrl) return null

  // Return cached token if still valid (with 30s safety margin)
  if (tokenCache && Date.now() < tokenCache.expiresAt - 30_000) {
    return tokenCache.accessToken
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  })
  if (scope) params.set('scope', scope)

  try {
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })

    if (!res.ok) {
      console.error(`[DVSA] OAuth token request failed: ${res.status} ${res.statusText}`)
      return null
    }

    const json = await res.json()
    const expiresIn = (json.expires_in ?? 300) as number

    tokenCache = {
      accessToken: json.access_token as string,
      expiresAt: Date.now() + expiresIn * 1000,
    }

    return tokenCache.accessToken
  } catch (err) {
    console.error('[DVSA] OAuth token fetch failed:', err)
    return null
  }
}

// ── DVSA MOT History fetch ────────────────────────────────────────────────

// DVSA Trade API base URL (v1)
const DVSA_BASE = 'https://history.mot.api.gov.uk/v1/trade/vehicles/registration'

interface DvsaMotTest {
  completedDate?: string
  testResult?: string
  expiryDate?: string
  odometerValue?: number
  odometerUnit?: string
  defects?: Array<{
    text?: string
    type?: string // "ADVISORY" | "MAJOR" | "DANGEROUS" | "MINOR"
    dangerous?: boolean
  }>
}

interface DvsaRawResponse {
  registration?: string
  motTests?: DvsaMotTest[]
  [key: string]: unknown
}

/**
 * Fetch MOT summary for a given VRM from the DVSA Trade API.
 * Returns null on any failure — never throws.
 */
export async function fetchMotSummary(vrm: string): Promise<MotSummary | null> {
  const apiKey = process.env.DVSA_API_KEY
  if (process.env.DVSA_ENABLED !== 'true') return null

  if (!apiKey) {
    console.warn('[DVSA] DVSA_API_KEY not set — skipping MOT enrichment')
    return null
  }

  const normalized = normalizeVrm(vrm)

  try {
    return await dvsaRequest(normalized, apiKey, false)
  } catch (err) {
    console.error('[DVSA] Fetch failed:', err)
    return null
  }
}

// ── Request helper with 401 retry ──────────────────────────────────────────

/** Clear cached token so the next call fetches a fresh one. */
function clearTokenCache() {
  tokenCache = null
}

/**
 * Make the DVSA API request. If a 401 is returned (expired/invalid token),
 * clear the token cache and retry exactly once.
 */
async function dvsaRequest(
  normalized: string,
  apiKey: string,
  isRetry: boolean,
): Promise<MotSummary | null> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'X-API-Key': apiKey,
  }

  const token = await getAccessToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${DVSA_BASE}/${encodeURIComponent(normalized)}`, {
    method: 'GET',
    headers,
  })

  if (res.status === 404) {
    return {
      status: 'NO_RESULTS',
      expiryDate: null,
      lastTestDate: null,
      odometerAtLastTest: null,
      advisoryCount: 0,
      majorCount: 0,
      dangerousCount: 0,
      flags: ['No MOT history found — vehicle may be under 3 years old'],
    }
  }

  // 401 = token expired or invalid — clear cache and retry once
  if (res.status === 401 && !isRetry) {
    console.warn('[DVSA] Got 401 — clearing token cache and retrying once')
    clearTokenCache()
    return dvsaRequest(normalized, apiKey, true)
  }

  if (!res.ok) {
    console.error(`[DVSA] API error: ${res.status} ${res.statusText}`)
    return null
  }

  const raw: DvsaRawResponse = await res.json()
  return parseDvsaResponse(raw)
}

// ── Response parser ────────────────────────────────────────────────────────

function parseDvsaResponse(raw: DvsaRawResponse): MotSummary {
  const tests = raw.motTests ?? []

  if (tests.length === 0) {
    return {
      status: 'NO_RESULTS',
      expiryDate: null,
      lastTestDate: null,
      odometerAtLastTest: null,
      advisoryCount: 0,
      majorCount: 0,
      dangerousCount: 0,
      flags: ['No MOT tests on record'],
    }
  }

  // Most recent test is first in the array
  const latest = tests[0]
  const defects: Array<{ text?: string; type?: string; dangerous?: boolean }> =
    (latest as any).defects ??
    (latest as any).rfrAndComments ??
    []

  const advisoryCount = defects.filter((d) => d.type === 'ADVISORY').length
  const majorCount = defects.filter((d) => d.type === 'MAJOR').length
  const dangerousCount = defects.filter((d) => d.type === 'DANGEROUS' || d.dangerous).length

  const flags: string[] = []
  if (latest.testResult === 'FAILED') flags.push('Last MOT: FAILED')
  if (dangerousCount > 0) flags.push(`${dangerousCount} dangerous fault(s)`)
  if (majorCount > 0) flags.push(`${majorCount} major fault(s)`)
  if (advisoryCount >= 5) flags.push(`High advisory count (${advisoryCount})`)

  // Check if MOT is expired or expiring soon
  if (latest.expiryDate) {
    const expiry = new Date(latest.expiryDate)
    const now = new Date()
    const daysUntilExpiry = Math.floor(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysUntilExpiry < 0) flags.push('MOT EXPIRED')
    else if (daysUntilExpiry <= 30) flags.push(`MOT expires in ${daysUntilExpiry} days`)
  }

  return {
    status: latest.testResult ?? 'UNKNOWN',
    expiryDate: latest.expiryDate ?? null,
    lastTestDate: latest.completedDate ?? null,
    odometerAtLastTest: latest.odometerValue ?? null,
    advisoryCount,
    majorCount,
    dangerousCount,
    flags,
  }
}
