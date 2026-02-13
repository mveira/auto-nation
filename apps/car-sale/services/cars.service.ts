import { Car, CARS } from "@/data/cars"

export interface FilterOptions {
  make?: string
  bodyType?: string
  fuelType?: string
  transmission?: string
  minPrice?: number
  maxPrice?: number
  maxMileage?: number
}

export interface SortOptions {
  sortBy: "price-asc" | "price-desc" | "mileage-asc" | "year-desc"
}

/**
 * Get all cars with optional filtering and sorting
 */
export function getCars(
  filters?: FilterOptions,
  sort?: SortOptions
): Car[] {
  let results = [...CARS]

  // Apply filters
  if (filters) {
    if (filters.make) {
      results = results.filter(
        (car) => car.make.toLowerCase() === filters.make?.toLowerCase()
      )
    }
    if (filters.bodyType) {
      results = results.filter((car) => car.bodyType === filters.bodyType)
    }
    if (filters.fuelType) {
      results = results.filter((car) => car.fuelType === filters.fuelType)
    }
    if (filters.transmission) {
      results = results.filter(
        (car) => car.transmission === filters.transmission
      )
    }
    if (filters.minPrice !== undefined) {
      results = results.filter((car) => car.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter((car) => car.price <= filters.maxPrice!)
    }
    if (filters.maxMileage !== undefined) {
      results = results.filter((car) => car.mileage <= filters.maxMileage!)
    }
  }

  // Apply sorting
  if (sort) {
    switch (sort.sortBy) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        results.sort((a, b) => b.price - a.price)
        break
      case "mileage-asc":
        results.sort((a, b) => a.mileage - b.mileage)
        break
      case "year-desc":
        results.sort((a, b) => b.year - a.year)
        break
    }
  }

  return results
}

/**
 * Get a single car by ID
 */
export function getCarById(id: string): Car | undefined {
  return CARS.find((car) => car.id === id)
}

/**
 * Get featured/recommended cars
 */
export function getFeaturedCars(limit: number = 6): Car[] {
  // Return cars with "Excellent" condition and sorted by year
  return CARS.filter((car) => car.condition === "Excellent")
    .sort((a, b) => b.year - a.year)
    .slice(0, limit)
}

/**
 * Get all unique makes
 */
export function getAllMakes(): string[] {
  const makes = CARS.map((car) => car.make)
  return Array.from(new Set(makes)).sort()
}

/**
 * Get all unique body types
 */
export function getAllBodyTypes(): string[] {
  const types = CARS.map((car) => car.bodyType)
  return Array.from(new Set(types)).sort()
}

/**
 * Get all unique fuel types
 */
export function getAllFuelTypes(): string[] {
  const types = CARS.map((car) => car.fuelType)
  return Array.from(new Set(types)).sort()
}

/**
 * Get price range
 */
export function getPriceRange(): { min: number; max: number } {
  const prices = CARS.map((car) => car.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

/**
 * Search cars by text query
 */
export function searchCars(query: string): Car[] {
  const lowerQuery = query.toLowerCase()
  return CARS.filter(
    (car) =>
      car.make.toLowerCase().includes(lowerQuery) ||
      car.model.toLowerCase().includes(lowerQuery) ||
      car.description.toLowerCase().includes(lowerQuery) ||
      car.features.some((f) => f.toLowerCase().includes(lowerQuery))
  )
}
