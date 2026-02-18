/**
 * Vehicle View Tracking API
 *
 * POST /api/vehicle-view — records a page view for a vehicle.
 * GET  /api/vehicle-view?vehicleKey=<id> — reads counts without recording.
 *
 * Tracks two metrics:
 *   - totalViews: lifetime count (since last deploy)
 *   - viewingNow: unique viewers in the last 5 minutes (cookie-based)
 *
 * Storage: in-memory Map. Resets on every deploy/restart.
 * Future: persist to Strapi custom endpoint or Redis for durable counts.
 *
 * Identity: anonymous viewer_id cookie (httpOnly, 1-year TTL).
 * vehicleKey is currently the car `id`; will become `slug` after route migration.
 */
import { NextRequest, NextResponse } from "next/server"

const viewStore = new Map<
  string,
  { totalViews: number; recent: Array<{ viewerId: string; ts: number }> }
>()

const VIEWING_NOW_WINDOW_MS = 5 * 60 * 1000 // 5 minutes

function pruneRecent(recent: Array<{ viewerId: string; ts: number }>) {
  const cutoff = Date.now() - VIEWING_NOW_WINDOW_MS
  return recent.filter((r) => r.ts > cutoff)
}

function getViewingNowCount(recent: Array<{ viewerId: string; ts: number }>) {
  const pruned = pruneRecent(recent)
  const uniqueViewers = new Set(pruned.map((r) => r.viewerId))
  return uniqueViewers.size
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicleKey } = body

    if (!vehicleKey || typeof vehicleKey !== "string") {
      return NextResponse.json(
        { error: "vehicleKey is required" },
        { status: 400 }
      )
    }

    // Read or create viewer_id cookie
    let viewerId = request.cookies.get("viewer_id")?.value
    const response = NextResponse.json({ success: true })

    if (!viewerId) {
      viewerId = crypto.randomUUID()
      response.cookies.set("viewer_id", viewerId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      })
    }

    // Update store
    const existing = viewStore.get(vehicleKey) ?? {
      totalViews: 0,
      recent: [],
    }

    existing.totalViews += 1
    existing.recent = pruneRecent(existing.recent)
    existing.recent.push({ viewerId, ts: Date.now() })
    viewStore.set(vehicleKey, existing)

    const viewingNow = getViewingNowCount(existing.recent)

    return NextResponse.json(
      {
        success: true,
        totalViews: existing.totalViews,
        viewingNow,
      },
      {
        status: 200,
        headers: response.headers,
      }
    )
  } catch {
    return NextResponse.json(
      { error: "Failed to record view" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const vehicleKey = request.nextUrl.searchParams.get("vehicleKey")

  if (!vehicleKey) {
    return NextResponse.json(
      { error: "vehicleKey query param is required" },
      { status: 400 }
    )
  }

  const existing = viewStore.get(vehicleKey)

  if (!existing) {
    return NextResponse.json({ totalViews: 0, viewingNow: 0 })
  }

  existing.recent = pruneRecent(existing.recent)
  const viewingNow = getViewingNowCount(existing.recent)

  return NextResponse.json({
    totalViews: existing.totalViews,
    viewingNow,
  })
}
