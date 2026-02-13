import Link from "next/link"
import { Hero } from "@/components/Hero"
import { TrustBadges } from "@/components/TrustBadges"
import { SocialProof } from "@/components/SocialProof"
import { UrgencyBanner } from "@/components/UrgencyBanner"
import { SpotlightVehicle } from "@/components/SpotlightVehicle"
import { CarCard } from "@/components/CarCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getFeaturedCars, getAllMakes, getCars } from "@/services/cars.service"
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react"

export default function HomePage() {
  const featuredCars = getFeaturedCars(6)
  const allMakes = getAllMakes()

  // Get popular makes (those with most cars in inventory)
  const popularMakes = allMakes
    .map((make) => ({
      make,
      count: getCars({ make }).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  // Get spotlight vehicle - prioritize featured vehicles
  const premiumBrands = ["Porsche", "McLaren", "Bentley", "Maserati", "Ferrari", "Lamborghini", "Range Rover", "Mercedes-Benz", "BMW", "Audi"]
  const spotlightCar = getCars()
    .filter((car) => premiumBrands.includes(car.make) || car.price > 50000)
    .sort((a, b) => {
      // Prioritize exotic brands first, then by price
      const aIsExotic = ["McLaren", "Bentley", "Maserati", "Ferrari", "Lamborghini"].includes(a.make)
      const bIsExotic = ["McLaren", "Bentley", "Maserati", "Ferrari", "Lamborghini"].includes(b.make)
      if (aIsExotic && !bIsExotic) return -1
      if (!aIsExotic && bIsExotic) return 1
      return b.price - a.price
    })[0] || featuredCars[0]

  return (
    <>
      <Hero />
      <UrgencyBanner />

      {/* Quick Make Filters */}
      <section className="bg-zinc-950 py-8 px-4 border-b border-zinc-800">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-400 tracking-wider">SHOP BY BRAND</h3>
            <Link href="/inventory" className="text-xs text-primary hover:underline font-semibold">
              VIEW ALL →
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {popularMakes.map(({ make, count }) => (
              <Link key={make} href={`/inventory?make=${make}`}>
                <Button
                  variant="outline"
                  className="border-zinc-800 hover:border-primary hover:bg-primary/10 font-bold group"
                >
                  {make}
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-zinc-800 group-hover:bg-primary/20 group-hover:text-primary"
                  >
                    {count}
                  </Badge>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* Spotlight Vehicle */}
      <SpotlightVehicle car={spotlightCar} />

      {/* Featured Collection */}
      <section className="container mx-auto px-4 py-20 relative">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-1/2 h-96 bg-primary/5 blur-3xl rounded-full"></div>

        <div className="relative">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/30 px-6 py-2 text-sm">
              <Zap className="h-4 w-4 mr-2" />
              HAND-SELECTED COLLECTION
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
              QUALITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-zinc-300">VEHICLES</span>
            </h2>
            <p className="text-zinc-400 text-xl font-light max-w-3xl mx-auto mb-8">
              Every vehicle in our collection is personally inspected, verified, and prepared to the highest standards
            </p>

            {/* Value props */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">FULL SERVICE HISTORY</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">COMPETITIVE PRICING</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">READY TO DRIVE</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCars.map((car, index) => (
              <div
                key={car.id}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <CarCard car={car} index={index} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/inventory">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-black text-lg px-12 py-7 shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.5)]">
                VIEW FULL COLLECTION
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-zinc-500 text-sm mt-4">
              Quality checked vehicles • Full warranty included
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProof />

      {/* Final CTA - Premium Invitation */}
      <section className="bg-gradient-to-br from-zinc-950 via-black to-zinc-950 py-24 px-4 border-t border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.05),transparent_70%)]"></div>

        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/30 px-6 py-2">
            <TrendingUp className="h-4 w-4 mr-2" />
            CURATED COLLECTION
          </Badge>

          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">
            DISCOVER YOUR <span className="text-primary">MASTERPIECE</span>
          </h2>
          <p className="text-xl md:text-2xl mb-4 text-zinc-300 font-light max-w-3xl mx-auto">
            Speak with our specialists about exceptional vehicles
          </p>
          <p className="text-zinc-500 mb-10">
            Dedicated service · <span className="text-primary font-bold">Expert guidance</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <a
              href="https://wa.me/YOUR_PHONE_NUMBER"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-black font-black text-base sm:text-lg px-6 sm:px-12 py-7 shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                <Zap className="mr-2 h-5 w-5" />
                SPEAK TO SPECIALIST
              </Button>
            </a>
            <Link href="/inventory" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-zinc-700 hover:border-primary text-base sm:text-lg px-6 sm:px-12 py-7 font-bold">
                EXPLORE COLLECTION
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
