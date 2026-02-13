"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Car } from "@/data/cars"
import { RotateCw, Maximize2, Sparkles } from "lucide-react"

interface PremiumShowcaseProps {
  car: Car
}

export function PremiumShowcase({ car }: PremiumShowcaseProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isRotating, setIsRotating] = useState(true)

  useEffect(() => {
    if (!isRotating || car.images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [isRotating, car.images.length])

  return (
    <div className="relative h-[600px] bg-gradient-to-br from-zinc-950 via-black to-zinc-900 rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl group">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>
      </div>

      {/* Main image carousel */}
      <div className="relative h-full">
        {car.images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={image}
              alt={`${car.make} ${car.model} - View ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Animated glow border */}
        <div className="absolute inset-0 border-4 border-primary/0 group-hover:border-primary/30 transition-all duration-500 rounded-2xl"></div>
      </div>

      {/* Top badges */}
      <div className="absolute top-6 right-6 space-y-3 z-20">
        <Badge className="bg-black/90 backdrop-blur-xl text-primary border-primary/30 text-sm px-4 py-2 shadow-lg animate-pulse">
          <Sparkles className="h-4 w-4 mr-2" />
          INTERACTIVE VIEW
        </Badge>
        <Badge className="bg-black/90 backdrop-blur-xl text-white border-zinc-700 text-sm px-4 py-2 shadow-lg">
          {car.condition}
        </Badge>
      </div>

      {/* Rotation control */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`flex items-center gap-2 bg-black/90 backdrop-blur-xl border px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 ${isRotating
              ? "border-primary text-primary"
              : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
            }`}
        >
          <RotateCw className={`h-4 w-4 ${isRotating ? "animate-spin" : ""}`} />
          {isRotating ? "AUTO-ROTATE ON" : "AUTO-ROTATE OFF"}
        </button>
      </div>

      {/* Feature highlights - Top right, not overlapping controls */}
      <div className="absolute top-20 right-6 bg-black/90 backdrop-blur-xl border border-zinc-700 rounded-lg p-4 z-20 max-w-xs">
        <p className="text-xs text-zinc-400 mb-3 font-semibold uppercase tracking-wider">Key Features</p>
        <div className="flex flex-wrap gap-2">
          {car.features.slice(0, 4).map((feature, index) => (
            <Badge key={index} variant="outline" className="border-zinc-600 text-zinc-300 text-xs">
              ✓ {feature}
            </Badge>
          ))}
          {car.features.length > 4 && (
            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
              +{car.features.length - 4} more
            </Badge>
          )}
        </div>
      </div>

      {/* Image indicators - Large and prominent at bottom */}
      {car.images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-5 z-40">
          {car.images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentImageIndex(index)
                setIsRotating(false)
              }}
              className={`h-4 rounded-full transition-all shadow-lg ${index === currentImageIndex
                  ? "w-20 bg-primary shadow-[0_0_25px_rgba(255,215,0,1)]"
                  : "w-4 bg-white/80 hover:bg-white"
                }`}
              aria-label={`View angle ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Floating particles effect - Fixed positions to avoid hydration mismatch */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: 10, top: 20, delay: 0, duration: 2 },
          { left: 85, top: 15, delay: 0.5, duration: 3 },
          { left: 30, top: 70, delay: 1, duration: 2.5 },
          { left: 70, top: 40, delay: 1.5, duration: 3.5 },
          { left: 50, top: 85, delay: 2, duration: 2.8 },
          { left: 15, top: 50, delay: 0.3, duration: 3.2 },
          { left: 90, top: 60, delay: 1.2, duration: 2.3 },
          { left: 45, top: 25, delay: 0.8, duration: 3.8 },
          { left: 65, top: 75, delay: 1.8, duration: 2.6 },
          { left: 25, top: 35, delay: 0.6, duration: 3.3 },
        ].map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
