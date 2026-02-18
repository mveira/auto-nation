"use client"

import { useEffect, useState } from "react"
import { Eye, Clock } from "lucide-react"

interface VehicleViewTrackerProps {
  vehicleKey: string
}

/**
 * Client component that tracks and displays real vehicle views.
 * Calls POST /api/vehicle-view on mount, then displays totalViews + viewingNow.
 * Does NOT block server rendering — mounts client-side only.
 */
export function VehicleViewTracker({ vehicleKey }: VehicleViewTrackerProps) {
  const [totalViews, setTotalViews] = useState<number>(0)
  const [viewingNow, setViewingNow] = useState<number>(0)

  useEffect(() => {
    let cancelled = false

    async function trackView() {
      try {
        const res = await fetch("/api/vehicle-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicleKey }),
        })
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        setTotalViews(data.totalViews ?? 0)
        setViewingNow(data.viewingNow ?? 0)
      } catch {
        // Fail silently — tracking should never break the page
      }
    }

    trackView()
    return () => { cancelled = true }
  }, [vehicleKey])

  return (
    <>
      {/* Premium info bar — replaces the old static bar */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800 py-2 px-4">
        <div className="container mx-auto flex items-center justify-center gap-3 text-sm flex-wrap">
          <Eye className="h-4 w-4 text-primary" />
          <span className="font-semibold text-zinc-300">
            <span className="text-primary">{totalViews}</span> views
          </span>
          {viewingNow > 0 && (
            <>
              <span className="text-zinc-600">·</span>
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-semibold text-zinc-300">
                <span className="text-primary">{viewingNow}</span> viewing now
              </span>
            </>
          )}
        </div>
      </div>
    </>
  )
}

/**
 * Inline view stats for the detail page sidebar area.
 * Shares the same data pattern — call separately or lift state up.
 */
export function VehicleViewStats({ vehicleKey }: VehicleViewTrackerProps) {
  const [totalViews, setTotalViews] = useState<number>(0)
  const [viewingNow, setViewingNow] = useState<number>(0)

  useEffect(() => {
    let cancelled = false

    async function fetchStats() {
      try {
        const res = await fetch(`/api/vehicle-view?vehicleKey=${encodeURIComponent(vehicleKey)}`)
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        setTotalViews(data.totalViews ?? 0)
        setViewingNow(data.viewingNow ?? 0)
      } catch {
        // Fail silently
      }
    }

    fetchStats()
    return () => { cancelled = true }
  }, [vehicleKey])

  return (
    <div className="flex items-center gap-4 mb-4 text-sm text-zinc-400">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4" />
        <span>{totalViews} views</span>
      </div>
      {viewingNow > 0 && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{viewingNow} viewing now</span>
        </div>
      )}
    </div>
  )
}
