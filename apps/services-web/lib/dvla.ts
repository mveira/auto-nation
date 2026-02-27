// ---------------------------------------------------------------------------
// DVLA Vehicle Enquiry Service — server-side only
// Docs: https://developer-portal.driver-vehicle-licensing.api.gov.uk/apis/vehicle-enquiry-service/vehicle-enquiry-service-description.html
// ---------------------------------------------------------------------------

const DVLA_ENDPOINT =
  "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles"

// ── Types ──────────────────────────────────────────────────────────────────

/** Normalised vehicle data returned to the client. */
export interface VehicleData {
  vrm: string
  make: string
  colour: string
  fuelType: string
  engineCapacity: number | null
  yearOfManufacture: number | null
  monthOfFirstRegistration: string | null
}

// TODO: Integrate DVSA MOT History API here
// When DVSA is wired up, the combined lookup response should be:
//   { vehicle: VehicleData, mot: MotHistoryData }
// Keep VehicleData stable — add a new MotHistoryData interface alongside it.

/** Shape returned by the DVLA VES API (fields we use — full response has more). */
interface DvlaRawResponse {
  registrationNumber: string
  make: string
  colour: string
  fuelType: string
  engineCapacity?: number
  yearOfManufacture?: number
  monthOfFirstRegistration?: string
  [key: string]: unknown // forward-compat with new fields
}

export interface LookupSuccess {
  success: true
  data: VehicleData
}

export interface LookupError {
  success: false
  error: string
}

export type LookupResult = LookupSuccess | LookupError

// ── VRM helpers ────────────────────────────────────────────────────────────

/** Uppercase + strip whitespace. */
export function normalizeVrm(raw: string): string {
  return raw.toUpperCase().replace(/\s+/g, "")
}

/**
 * Basic UK vehicle registration format check.
 * Covers current-style (AB12CDE), prefix (A123BCD), suffix (ABC123D),
 * and dateless (1234AB / AB1234) patterns.
 */
export function isValidVrm(vrm: string): boolean {
  // Current style: 2 letters, 2 digits, 3 letters
  // Prefix style: 1 letter, 1-3 digits, 3 letters
  // Suffix style: 3 letters, 1-3 digits, 1 letter
  // Dateless: 1-4 digits + 1-3 letters OR 1-3 letters + 1-4 digits
  const patterns = [
    /^[A-Z]{2}\d{2}[A-Z]{3}$/, // current
    /^[A-Z]\d{1,3}[A-Z]{3}$/,  // prefix
    /^[A-Z]{3}\d{1,3}[A-Z]$/,  // suffix
    /^\d{1,4}[A-Z]{1,3}$/,     // dateless numeric-first
    /^[A-Z]{1,3}\d{1,4}$/,     // dateless alpha-first
  ]
  return patterns.some((p) => p.test(vrm))
}

// ── DVLA fetch ─────────────────────────────────────────────────────────────

export async function lookupVehicle(vrm: string): Promise<LookupResult> {
  const apiKey = process.env.DVLAAPI_KEY
  if (!apiKey) {
    return { success: false, error: "Vehicle lookup is not configured." }
  }

  const normalized = normalizeVrm(vrm)

  if (!isValidVrm(normalized)) {
    return { success: false, error: "Please enter a valid UK registration number." }
  }

  try {
    const res = await fetch(DVLA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ registrationNumber: normalized }),
    })

    if (res.status === 404) {
      return { success: false, error: "Vehicle not found. Please check the registration and try again." }
    }

    if (!res.ok) {
      return { success: false, error: "Unable to look up vehicle. Please try again later." }
    }

    const raw: DvlaRawResponse = await res.json()

    const data: VehicleData = {
      vrm: raw.registrationNumber,
      make: raw.make,
      colour: raw.colour,
      fuelType: raw.fuelType,
      engineCapacity: raw.engineCapacity ?? null,
      yearOfManufacture: raw.yearOfManufacture ?? null,
      monthOfFirstRegistration: raw.monthOfFirstRegistration ?? null,
    }

    return { success: true, data }
  } catch {
    return { success: false, error: "Unable to reach the vehicle lookup service. Please try again later." }
  }
}
