"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CarCard } from "@/components/CarCard"
import { CarFilters } from "@/components/CarFilters"
import { Badge } from "@/components/ui/badge"
import { Hero } from "@/components/Hero"
import {
  getCars,
  getAllMakes,
  getAllBodyTypes,
  getAllFuelTypes,
  FilterOptions,
} from "@/services/cars.service"

export function InventoryContent() {
  const searchParams = useSearchParams()
  const makeParam = searchParams.get("make")

  const [filters, setFilters] = useState<FilterOptions>(
    makeParam ? { make: makeParam } : {}
  )
  const [sortBy, setSortBy] = useState<
    "price-asc" | "price-desc" | "mileage-asc" | "year-desc"
  >("year-desc")

  // Update filters when URL param changes
  useEffect(() => {
    if (makeParam && makeParam !== filters.make) {
      setFilters((prev) => ({ ...prev, make: makeParam }))
    }
  }, [makeParam, filters.make])

  const cars = getCars(filters, { sortBy })
  const makes = getAllMakes()
  const bodyTypes = getAllBodyTypes()
  const fuelTypes = getAllFuelTypes()

  return (
    <>
      {/* Show hero if filtered by make */}
      {makeParam && <Hero filteredMake={makeParam} />}

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 relative">
          <div className="absolute -top-20 right-0 w-96 h-96 bg-primary/5 blur-3xl rounded-full"></div>

          {/* Breadcrumb */}
          {makeParam && (
            <div className="mb-6 text-sm text-zinc-500">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span className="mx-2">/</span>
              <a href="/inventory" className="hover:text-primary transition-colors">Inventory</a>
              <span className="mx-2">/</span>
              <span className="text-primary font-bold">{makeParam}</span>
            </div>
          )}

          <Badge className="mb-6 bg-primary/10 text-primary border-primary/30 px-6 py-2 inline-flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {cars.length} VEHICLES IN STOCK
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter relative">
            {makeParam ? (
              <>
                {makeParam.toUpperCase()} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-400">COLLECTION</span>
              </>
            ) : (
              <>
                FULL <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-400">INVENTORY</span>
              </>
            )}
          </h1>
          <p className="text-zinc-400 text-xl font-light max-w-2xl">
            {makeParam
              ? `Explore our complete ${makeParam} lineup. Every vehicle inspected and ready to drive.`
              : "Browse our complete collection of quality used cars and vans. New stock added weekly."
            }
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <CarFilters
              makes={makes}
              bodyTypes={bodyTypes}
              fuelTypes={fuelTypes}
              onFilterChange={setFilters}
              totalCars={cars.length}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="mb-8 flex items-center justify-between bg-zinc-900 p-4 rounded-lg border border-zinc-800">
              <p className="text-zinc-400 font-semibold">
                <span className="text-primary font-black">{cars.length}</span> {cars.length === 1 ? "VEHICLE" : "VEHICLES"}
              </p>
              <select
                className="h-10 rounded-md border border-zinc-700 bg-black px-4 py-2 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                    | "price-asc"
                    | "price-desc"
                    | "mileage-asc"
                    | "year-desc"
                  )
                }
              >
                <option value="year-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="mileage-asc">Lowest Mileage</option>
              </select>
            </div>

            {/* Cars Grid */}
            {cars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {cars.map((car, index) => (
                  <CarCard key={car.id} car={car} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-900 rounded-lg border border-zinc-800">
                <p className="text-2xl font-bold mb-4">
                  NO VEHICLES FOUND
                </p>
                <p className="text-zinc-400">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
