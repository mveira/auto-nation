"use client"

import { Sparkles } from "lucide-react"

export function UrgencyBanner() {
  return (
    <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-y border-zinc-800 py-3 px-4">
      <div className="container mx-auto flex items-center justify-center gap-3 flex-wrap text-center">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold text-zinc-300">
          <span className="text-primary">Fresh Inventory</span> · New arrivals added weekly
        </p>
      </div>
    </div>
  )
}
