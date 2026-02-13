import { Suspense } from "react"
import { InventoryContent } from "./InventoryContent"

// Force dynamic rendering for this page since it uses searchParams
export const dynamic = 'force-dynamic'

export default function InventoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-zinc-400">Loading inventory...</p>
      </div>
    </div>}>
      <InventoryContent />
    </Suspense>
  )
}

