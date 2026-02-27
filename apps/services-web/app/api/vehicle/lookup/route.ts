import { NextRequest, NextResponse } from "next/server"
import { lookupVehicle, normalizeVrm } from "@/lib/dvla"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vrm } = body as { vrm?: string }

    if (!vrm || typeof vrm !== "string" || vrm.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Registration number is required." },
        { status: 400 }
      )
    }

    const result = await lookupVehicle(normalizeVrm(vrm))

    if (!result.success) {
      // 422 for validation / not-found, not 500
      return NextResponse.json(result, { status: 422 })
    }

    // TODO: Integrate DVSA MOT History API here
    // Once DVSA is wired, merge the response:
    //   const motResult = await lookupMotHistory(result.data.vrm)
    //   return NextResponse.json({
    //     success: true,
    //     data: { vehicle: result.data, mot: motResult }
    //   })

    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { success: false, error: "An error occurred processing your request." },
      { status: 500 }
    )
  }
}
