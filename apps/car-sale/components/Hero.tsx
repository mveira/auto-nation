"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, Award, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { getFeaturedCars, getCars } from "@/services/cars.service"
import { siteSettings } from "@/lib/siteSettings"

interface HeroProps {
  filteredMake?: string
}

export function Hero({ filteredMake }: HeroProps) {
  // If a make is filtered, get cars of that make, otherwise get featured
  const allCars = filteredMake
    ? getCars({ make: filteredMake }).slice(0, 5) // Get up to 5 cars of that make
    : getFeaturedCars(3)

  const featuredCars = allCars.length > 0 ? allCars : getFeaturedCars(3) // Fallback
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredCars.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [featuredCars.length])

  const currentCar = featuredCars[currentIndex]

  return (
    <div className="relative bg-black text-white min-h-screen flex items-start md:items-center overflow-hidden">
      {/* Car image background with parallax effect */}
      <div className="absolute inset-0">
        {featuredCars.map((car, index) => (
          <div
            key={car.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={car.image}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Gradient overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
          </div>
        ))}
      </div>

      {/* Accent glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,215,0,0.15),transparent_50%)]"></div>

      <div className="container mx-auto px-4 relative z-10 pt-8 md:pt-0">
        <div className="max-w-5xl overflow-hidden">
          {/* Filtered badge */}
          {filteredMake && (
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/50 px-4 py-2 rounded-full mb-6 backdrop-blur-xl animate-pulse">
              <Filter className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold tracking-wider">
                {filteredMake.toUpperCase()} COLLECTION • {featuredCars.length} VEHICLES
              </span>
            </div>
          )}

          {/* Featured car badge */}
          <div className="inline-flex items-center gap-2 md:gap-3 bg-zinc-900/80 border border-zinc-700 px-3 md:px-4 py-2 rounded-lg mb-6 backdrop-blur-xl max-w-full overflow-hidden">
            <div className="text-left min-w-0">
              <p className="text-[10px] md:text-xs text-zinc-400 font-semibold uppercase tracking-wide">Now Viewing</p>
              <p className="text-xs md:text-sm font-black text-primary truncate">
                {currentCar.year} {currentCar.make} {currentCar.model}
              </p>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 leading-none break-words">
            {filteredMake ? (
              <>
                {filteredMake.toUpperCase()}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-zinc-300 to-primary animate-gradient">
                  QUALITY
                </span>
              </>
            ) : (
              <>
                DRIVE<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-300 to-primary animate-gradient">
                  EXCELLENCE
                </span>
              </>
            )}
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-zinc-300 font-light max-w-2xl">
            {filteredMake
              ? `Explore our ${filteredMake} collection - ${featuredCars.length} quality vehicles available`
              : "Quality used cars and vans for every journey"
            }
          </p>

          {/* Stats bar - Social Proof */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-12 max-w-2xl">
            <div className="bg-black/60 backdrop-blur-xl border border-zinc-800 p-2 sm:p-3 md:p-4 rounded-lg hover:border-primary/50 transition-all min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                {/* TODO: Wire to real inventory count from Strapi */}
                <p className="text-lg sm:text-xl md:text-2xl font-black text-primary">{getCars().length}+</p>
              </div>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-zinc-400 font-semibold leading-tight">QUALITY VEHICLES</p>
            </div>
            <div className="bg-black/60 backdrop-blur-xl border border-zinc-800 p-2 sm:p-3 md:p-4 rounded-lg hover:border-primary/50 transition-all min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                {/* TODO: Wire to real value from Strapi */}
                <p className="text-lg sm:text-xl md:text-2xl font-black text-primary">{siteSettings.yearsInBusiness}</p>
              </div>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-zinc-400 font-semibold leading-tight">YEARS IN BUSINESS</p>
            </div>
            <div className="bg-black/60 backdrop-blur-xl border border-zinc-800 p-2 sm:p-3 md:p-4 rounded-lg hover:border-primary/50 transition-all min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                {/* TODO: Wire to real rating from Strapi/Trustpilot */}
                <p className="text-lg sm:text-xl md:text-2xl font-black text-primary">{siteSettings.customerRating ?? "—"}</p>
              </div>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-zinc-400 font-semibold leading-tight">CUSTOMER RATING</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href={filteredMake ? `/inventory?make=${filteredMake}` : "/inventory"}>
              <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-7 bg-primary hover:bg-primary/90 text-black font-black shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] transition-all">
                <Zap className="mr-2 h-5 w-5" />
                {filteredMake ? `VIEW ALL ${filteredMake.toUpperCase()}` : "EXPLORE COLLECTION"}
              </Button>
            </Link>
            <a
              href="https://wa.me/YOUR_PHONE_NUMBER"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-7 border-2 border-zinc-700 text-white hover:bg-zinc-900 hover:border-primary font-bold backdrop-blur">
                SPEAK TO SPECIALIST
              </Button>
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 md:gap-4 text-[10px] md:text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="whitespace-nowrap">{filteredMake ? `${featuredCars.length} ${filteredMake.toUpperCase()}` : `${getCars().length} VEHICLES`} IN STOCK</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <span className="whitespace-nowrap">WARRANTY INCLUDED</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <span className="whitespace-nowrap">PART EXCHANGE WELCOME</span>
            </div>
            {filteredMake && (
              <Link href="/inventory" className="flex items-center gap-2 hover:text-primary transition-colors">
                <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
                <span className="underline">VIEW ALL MAKES</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Carousel controls */}
      <div className="absolute bottom-8 sm:bottom-6 md:bottom-8 right-4 md:right-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-2 md:gap-4 z-20">
        {/* Indicators - shown first on mobile (top), middle on desktop */}
        <div className="flex gap-1.5 md:gap-2 order-1 sm:order-2">
          {featuredCars.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${index === currentIndex
                  ? "w-6 md:w-8 bg-primary"
                  : "w-2 bg-zinc-600 hover:bg-zinc-500"
                }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2 md:gap-3 order-2 sm:order-none">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + featuredCars.length) % featuredCars.length)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 backdrop-blur-xl border border-zinc-700 hover:border-primary flex items-center justify-center transition-all hover:scale-110"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredCars.length)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 backdrop-blur-xl border border-zinc-700 hover:border-primary flex items-center justify-center transition-all hover:scale-110"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>

      {/* Quick view button */}
      <Link
        href={`/cars/${currentCar.id}`}
        className="absolute bottom-4 md:bottom-8 left-4 md:left-8 z-20 hidden md:flex items-center gap-2 bg-primary/90 hover:bg-primary text-black font-bold px-6 py-3 rounded-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
      >
        <Zap className="h-4 w-4" />
        VIEW THIS {currentCar.make.toUpperCase()}
      </Link>
    </div>
  )
}
