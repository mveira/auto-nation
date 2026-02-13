"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, SlidersHorizontal } from "lucide-react"

interface FilterValues {
  make: string
  bodyType: string
  fuelType: string
  transmission: string
  maxPrice: string
  maxMileage: string
}

interface CarFiltersProps {
  makes: string[]
  bodyTypes: string[]
  fuelTypes: string[]
  onFilterChange: (filters: any) => void
  totalCars: number
}

export function CarFilters({
  makes,
  bodyTypes,
  fuelTypes,
  onFilterChange,
  totalCars,
}: CarFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const makeParam = searchParams.get("make")
  
  const [showMobile, setShowMobile] = useState(false)
  const [filters, setFilters] = useState<FilterValues>({
    make: makeParam || "",
    bodyType: "",
    fuelType: "",
    transmission: "",
    maxPrice: "",
    maxMileage: "",
  })
  
  // Update filters when URL param changes
  useEffect(() => {
    if (makeParam && makeParam !== filters.make) {
      setFilters((prev) => ({ ...prev, make: makeParam }))
    }
  }, [makeParam, filters.make])

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Update URL when make changes
    if (key === "make") {
      if (value) {
        router.push(`/inventory?make=${value}`)
      } else {
        router.push("/inventory")
      }
    }

    // Convert to service format
    const serviceFilters: any = {}
    if (newFilters.make) serviceFilters.make = newFilters.make
    if (newFilters.bodyType) serviceFilters.bodyType = newFilters.bodyType
    if (newFilters.fuelType) serviceFilters.fuelType = newFilters.fuelType
    if (newFilters.transmission)
      serviceFilters.transmission = newFilters.transmission
    if (newFilters.maxPrice)
      serviceFilters.maxPrice = parseInt(newFilters.maxPrice)
    if (newFilters.maxMileage)
      serviceFilters.maxMileage = parseInt(newFilters.maxMileage)

    onFilterChange(serviceFilters)
  }

  const clearFilters = () => {
    setFilters({
      make: "",
      bodyType: "",
      fuelType: "",
      transmission: "",
      maxPrice: "",
      maxMileage: "",
    })
    router.push("/inventory") // Clear URL params
    onFilterChange({})
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== "")

  const FilterContent = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold mb-2 block tracking-wide">MAKE</label>
          <select
            className="w-full h-10 rounded-md border border-zinc-700 bg-black px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            value={filters.make}
            onChange={(e) => handleFilterChange("make", e.target.value)}
          >
            <option value="">All Makes</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold mb-2 block tracking-wide">BODY TYPE</label>
          <select
            className="w-full h-10 rounded-md border border-zinc-700 bg-black px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            value={filters.bodyType}
            onChange={(e) => handleFilterChange("bodyType", e.target.value)}
          >
            <option value="">All Types</option>
            {bodyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold mb-2 block tracking-wide">FUEL TYPE</label>
          <select
            className="w-full h-10 rounded-md border border-zinc-700 bg-black px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            value={filters.fuelType}
            onChange={(e) => handleFilterChange("fuelType", e.target.value)}
          >
            <option value="">All Fuels</option>
            {fuelTypes.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold mb-2 block tracking-wide">TRANSMISSION</label>
          <select
            className="w-full h-10 rounded-md border border-zinc-700 bg-black px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            value={filters.transmission}
            onChange={(e) =>
              handleFilterChange("transmission", e.target.value)
            }
          >
            <option value="">All Types</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-bold mb-2 block tracking-wide">
            MAX PRICE (£)
          </label>
          <Input
            type="number"
            placeholder="e.g. 50000"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="bg-black border-zinc-700 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-bold mb-2 block tracking-wide">
            MAX MILEAGE
          </label>
          <Input
            type="number"
            placeholder="e.g. 30000"
            value={filters.maxMileage}
            onChange={(e) => handleFilterChange("maxMileage", e.target.value)}
            className="bg-black border-zinc-700 focus:border-primary"
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            className="w-full border-zinc-700 hover:bg-zinc-800 font-bold"
            onClick={clearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            CLEAR FILTERS
          </Button>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
          onClick={() => setShowMobile(!showMobile)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          FILTERS {hasActiveFilters && `(ACTIVE)`}
        </Button>
      </div>

      {/* Mobile Filter Panel */}
      {showMobile && (
        <Card className="lg:hidden mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Filters</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobile(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FilterContent />
          </CardContent>
        </Card>
      )}

      {/* Desktop Filters */}
      <Card className="hidden lg:block sticky top-24 bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-black tracking-tight">FILTERS</CardTitle>
          <p className="text-sm text-zinc-400"><span className="text-primary font-bold">{totalCars}</span> vehicles found</p>
        </CardHeader>
        <CardContent>
          <FilterContent />
        </CardContent>
      </Card>
    </>
  )
}
