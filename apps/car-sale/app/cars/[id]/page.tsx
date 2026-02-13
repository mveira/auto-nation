import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getCarById, getCars } from "@/services/cars.service"
import { formatPrice, formatMileage } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CarCard } from "@/components/CarCard"
import {
  Fuel,
  Gauge,
  Calendar,
  Cog,
  Car as CarIcon,
  Palette,
  DoorOpen,
  Users,
  Check,
  ArrowLeft,
  MessageCircle,
  Eye,
  Clock,
  Shield,
  AlertCircle,
  TrendingUp,
  Zap,
} from "lucide-react"

// Generate static params for all cars at build time
export async function generateStaticParams() {
  const cars = getCars()
  return cars.map((car) => ({
    id: car.id,
  }))
}

// Generate metadata for each car page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const car = getCarById(id)

  if (!car) {
    return {
      title: "Car Not Found",
    }
  }

  return {
    title: `${car.year} ${car.make} ${car.model} - ${formatPrice(car.price)}`,
    description: `${car.description.substring(0, 155)}...`,
    openGraph: {
      title: `${car.year} ${car.make} ${car.model}`,
      description: car.description,
      images: [car.image],
    },
  }
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const car = getCarById(id)

  if (!car) {
    notFound()
  }

  // Get similar cars
  const similarCars = getCars({ bodyType: car.bodyType })
    .filter((c) => c.id !== car.id)
    .slice(0, 3)

  // Premium indicators
  const viewCount = 127 + (parseInt(car.id) * 13) % 100
  const isHighDemand = car.price > 40000
  const isLowMileage = car.mileage < 15000

  // WhatsApp number
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "447123456789"

  const specs = [
    { icon: Calendar, label: "Year", value: car.year.toString() },
    { icon: Gauge, label: "Mileage", value: formatMileage(car.mileage) },
    { icon: Fuel, label: "Fuel Type", value: car.fuelType },
    { icon: Cog, label: "Transmission", value: car.transmission },
    { icon: CarIcon, label: "Body Type", value: car.bodyType },
    { icon: Palette, label: "Color", value: car.color },
    { icon: DoorOpen, label: "Doors", value: car.doors.toString() },
    { icon: Users, label: "Seats", value: car.seats.toString() },
  ]

  return (
    <>
      {/* Premium info bar */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800 py-2 px-4">
        <div className="container mx-auto flex items-center justify-center gap-3 text-sm flex-wrap">
          <Eye className="h-4 w-4 text-primary" />
          <span className="font-semibold text-zinc-300">
            <span className="text-primary">{viewCount}</span> views · Strong interest
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Link href="/inventory" className="inline-flex items-center text-sm mb-8 hover:text-primary font-semibold transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          BACK TO INVENTORY
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative h-[500px] w-full overflow-hidden rounded-lg bg-black border border-zinc-800">
              <Image
                src={car.image}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
                priority
              />
            </div>
            {car.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {car.images.slice(1).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-32 overflow-hidden rounded-lg bg-black border border-zinc-800 hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <Image
                      src={img}
                      alt={`${car.make} ${car.model} - ${idx + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-black/80 backdrop-blur text-primary border-primary/30">
                {car.condition}
              </Badge>
              {isHighDemand && (
                <Badge className="bg-primary/10 text-primary border-primary/30">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  PREMIUM SELECT
                </Badge>
              )}
              {isLowMileage && (
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Zap className="h-3 w-3 mr-1" />
                  LOW MILEAGE
                </Badge>
              )}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mb-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{viewCount} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Added this week</span>
              </div>
            </div>

            <p className="text-zinc-400 mb-2 text-sm font-semibold uppercase tracking-wider">{car.year} • REF: #{car.id}</p>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter leading-none">
              {car.make}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-400">{car.model}</span>
            </h1>

            {/* Price */}
            <div className="bg-zinc-900/70 border border-zinc-800 p-6 rounded-lg mb-6">
              <p className="text-xs text-zinc-500 mb-1 font-semibold uppercase">Price</p>
              <p className="text-5xl md:text-6xl font-black text-primary mb-2 tracking-tight">
                {formatPrice(car.price)}
              </p>
              <div className="flex gap-2 text-xs mt-3">
                <Badge variant="outline" className="border-zinc-700">
                  Part Exchange Welcome
                </Badge>
                <Badge variant="outline" className="border-zinc-700">
                  Warranty Included
                </Badge>
              </div>
            </div>

            <p className="text-zinc-300 mb-6 text-base leading-relaxed">{car.description}</p>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Shield className="h-4 w-4 text-primary" />
                <span>Warranty Included</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Check className="h-4 w-4 text-primary" />
                <span>HPI Clear</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Check className="h-4 w-4 text-primary" />
                <span>Full Service History</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Check className="h-4 w-4 text-primary" />
                <span>Extended Warranty Available</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 mb-12">
              <Link href={`/schedule?car=${encodeURIComponent(`${car.year} ${car.make} ${car.model}`)}&id=${car.id}`}>
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-black font-black text-lg py-7 shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.5)]">
                  <Calendar className="mr-2 h-5 w-5" />
                  SCHEDULE TEST DRIVE
                </Button>
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi, I'm interested in the ${car.year} ${car.make} ${car.model} (Ref: ${car.id})`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button size="lg" variant="outline" className="w-full border-zinc-700 hover:border-primary font-black text-lg py-7">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  ENQUIRE VIA WHATSAPP
                </Button>
              </a>
              <p className="text-center text-xs text-zinc-500">
                Average response time: <span className="text-primary font-bold">Under 2 minutes</span>
              </p>
            </div>

            {/* Specifications */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-black mb-6 tracking-tight">SPECIFICATIONS</h2>
                <div className="grid grid-cols-2 gap-6">
                  {specs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <spec.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 font-semibold tracking-wide uppercase">
                          {spec.label}
                        </p>
                        <p className="font-bold text-lg">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <Card className="mb-16 bg-zinc-900 border-zinc-800">
          <CardContent className="p-8">
            <h2 className="text-3xl font-black mb-8 tracking-tight">KEY <span className="text-primary">FEATURES</span></h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {car.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-black/50 rounded-lg border border-zinc-800">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Similar Cars */}
        {similarCars.length > 0 && (
          <div>
            <div className="mb-8">
              <div className="w-16 h-1 bg-primary mb-6"></div>
              <h2 className="text-4xl font-black mb-2 tracking-tighter">
                SIMILAR <span className="text-primary">VEHICLES</span>
              </h2>
              <p className="text-zinc-400">You might also be interested in</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarCars.map((similarCar) => (
                <CarCard key={similarCar.id} car={similarCar} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-zinc-800 shadow-2xl z-50">
        <div className="p-3 space-y-2">
          <Link href={`/schedule?car=${encodeURIComponent(`${car.year} ${car.make} ${car.model}`)}&id=${car.id}`}>
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-black font-black shadow-[0_0_30px_rgba(255,215,0,0.3)]">
              <Calendar className="mr-2 h-5 w-5" />
              SCHEDULE TEST DRIVE
            </Button>
          </Link>
          <a
            href={`https://wa.me/${whatsappNumber}?text=Hi, I'm interested in the ${car.year} ${car.make} ${car.model} (Ref: ${car.id})`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline" className="w-full border-zinc-700 font-bold">
              <MessageCircle className="mr-2 h-5 w-5" />
              WHATSAPP
            </Button>
          </a>
        </div>
      </div>
    </>
  )
}
