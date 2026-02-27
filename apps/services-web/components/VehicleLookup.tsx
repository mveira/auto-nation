"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, CheckCircle2, XCircle, Loader2, Car } from "lucide-react"
import type { VehicleData } from "@/lib/dvla"

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; vehicle: VehicleData }
  | { status: "error"; message: string }

interface VehicleLookupProps {
  /** Called when the user confirms the vehicle. */
  onConfirm?: (vehicle: VehicleData) => void
  /** Called when the user rejects and wants to try again. */
  onReset?: () => void
}

export function VehicleLookup({ onConfirm, onReset }: VehicleLookupProps) {
  const [vrm, setVrm] = useState("")
  const [state, setState] = useState<LookupState>({ status: "idle" })

  async function handleLookup() {
    const trimmed = vrm.trim()
    if (!trimmed) return

    setState({ status: "loading" })

    try {
      const res = await fetch("/api/vehicle/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vrm: trimmed }),
      })

      const json = await res.json()

      if (json.success) {
        setState({ status: "found", vehicle: json.data })
      } else {
        setState({ status: "error", message: json.error || "Lookup failed." })
      }
    } catch {
      setState({ status: "error", message: "Unable to reach the lookup service." })
    }
  }

  function handleReset() {
    setVrm("")
    setState({ status: "idle" })
    onReset?.()
  }

  function handleConfirm() {
    if (state.status === "found") {
      onConfirm?.(state.vehicle)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      handleLookup()
    }
  }

  const isLoading = state.status === "loading"

  return (
    <div className="space-y-4">
      {/* Input row */}
      {state.status !== "found" && (
        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="vrm-input" className="block text-sm font-bold tracking-wide uppercase mb-1.5">
              Registration
            </label>
            <Input
              id="vrm-input"
              value={vrm}
              onChange={(e) => setVrm(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="e.g. AB12 CDE"
              disabled={isLoading}
              className="bg-black border-zinc-700 focus:border-primary h-12 font-bold tracking-widest text-lg uppercase"
              autoComplete="off"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleLookup}
              disabled={isLoading || !vrm.trim()}
              className="h-12 font-bold px-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Find My Car
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Error state */}
      {state.status === "error" && (
        <p className="text-sm text-red-500 font-medium flex items-center gap-2">
          <XCircle className="h-4 w-4 flex-shrink-0" />
          {state.message}
        </p>
      )}

      {/* Vehicle confirmation card */}
      {state.status === "found" && (
        <Card className="border-primary/30">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary flex-shrink-0 border border-primary/10">
                <Car className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                  Vehicle Found
                </p>
                <p className="font-black text-lg tracking-tighter mb-3">
                  {state.vehicle.make}
                  {state.vehicle.yearOfManufacture && (
                    <span className="text-muted-foreground font-light ml-2 text-sm">
                      ({state.vehicle.yearOfManufacture})
                    </span>
                  )}
                </p>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Reg:</span>{" "}
                    <span className="font-semibold">{state.vehicle.vrm}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Colour:</span>{" "}
                    <span className="font-semibold">{state.vehicle.colour}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fuel:</span>{" "}
                    <span className="font-semibold">{state.vehicle.fuelType}</span>
                  </div>
                  {state.vehicle.engineCapacity && (
                    <div>
                      <span className="text-muted-foreground">Engine:</span>{" "}
                      <span className="font-semibold">{state.vehicle.engineCapacity}cc</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <Button onClick={handleConfirm} className="flex-1 font-bold">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Yes, this is my car
              </Button>
              <Button onClick={handleReset} variant="outline" className="font-bold">
                No, try again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
