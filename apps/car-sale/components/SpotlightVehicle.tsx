"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car } from "@/data/cars"
import { formatPrice, formatMileage } from "@/lib/utils"
import { Zap, Award, TrendingUp, ArrowRight, Gauge, Calendar, Eye } from "lucide-react"
import { FramerShowcase } from "./FramerShowcase"

interface SpotlightVehicleProps {
  car: Car
}

export function SpotlightVehicle({ car }: SpotlightVehicleProps) {
  return (
    <section className="relative bg-gradient-to-b from-black to-zinc-950 py-12 md:py-20 px-4 overflow-hidden border-y border-zinc-800">
      {/* Accent glow */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 bg-primary/10 blur-3xl rounded-full"></div>

      <div className="container mx-auto relative z-10 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start max-w-7xl mx-auto">
          {/* Left: Content */}
          <div className="overflow-hidden">
            {/* Spotlight badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-3 md:px-4 py-2 rounded-full mb-6 backdrop-blur-xl text-xs md:text-sm">
              <Zap className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              <span className="font-bold tracking-wider text-primary">
                SPOTLIGHT VEHICLE · FEATURED
              </span>
            </div>

            {/* Vehicle info */}
            <p className="text-zinc-500 text-xs md:text-sm font-semibold mb-2 uppercase tracking-wider">
              {car.year} • REF #{car.id}
            </p>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-none tracking-tighter break-words">
              {car.make}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-300 to-primary">
                {car.model}
              </span>
            </h2>

            <p className="text-lg md:text-xl text-zinc-300 mb-6 leading-relaxed max-w-xl">
              {car.description}
            </p>

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="h-4 w-4 text-primary" />
                  <p className="text-xs text-zinc-500 font-semibold uppercase">Mileage</p>
                </div>
                <p className="text-2xl font-black text-white">{formatMileage(car.mileage)}</p>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="text-xs text-zinc-500 font-semibold uppercase">Condition</p>
                </div>
                <p className="text-2xl font-black text-primary">{car.condition}</p>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-4 md:p-6 rounded-lg mb-8 overflow-hidden">
              <div className="flex items-start justify-between gap-2 flex-wrap md:flex-nowrap">
                <div className="min-w-0 flex-shrink">
                  <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase">Price</p>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black text-primary mb-2 tracking-tight break-words">
                    {formatPrice(car.price)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    <span className="text-xs md:text-sm text-zinc-400 whitespace-nowrap">High interest</span>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/30 text-xs whitespace-nowrap">
                    FEATURED
                  </Badge>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/cars/${car.id}`} className="flex-1">
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-black font-black text-lg py-7 shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.5)]"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  VIEW FULL DETAILS
                </Button>
              </Link>
              <a
                href={`https://wa.me/YOUR_PHONE_NUMBER?text=Hi, I'm interested in the Spotlight Vehicle: ${car.year} ${car.make} ${car.model} (Ref: ${car.id})`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-zinc-700 hover:border-primary text-lg py-7 font-bold backdrop-blur"
                >
                  ENQUIRE NOW
                </Button>
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 mt-6 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <Award className="h-3 w-3 text-primary" />
                <span>Full Service History</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-3 w-3 text-primary" />
                <span>HPI Clear</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-3 w-3 text-primary" />
                <span>Warranty Included</span>
              </div>
            </div>
          </div>

          {/* Right: Framer Motion Showcase */}
          <div className="relative overflow-hidden">
            <FramerShowcase car={car} />
          </div>
        </div>
      </div>
    </section>
  )
}
