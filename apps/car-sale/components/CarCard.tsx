import Link from "next/link"
import Image from "next/image"
import { Car } from "@/data/cars"
import { formatPrice, formatMileage } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fuel, Gauge, Eye, Clock, TrendingUp, Zap } from "lucide-react"

interface CarCardProps {
  car: Car
  index?: number
}

// Premium indicators and social proof
// TODO: Wire all flags from CMS (Strapi) — currently placeholders
const getCardPsychology = (car: Car, index: number = 0) => {
  const isNew = false // TODO: Wire to CMS "new arrival" flag
  const isHot = false // TODO: Wire to CMS featured/premium flag
  const viewCount = null // No per-card tracking — wire from Strapi aggregate query later
  const isLowMileage = false // TODO: Wire to CMS or threshold logic from settings

  return { isNew, isHot, viewCount, isLowMileage }
}

export function CarCard({ car, index = 0 }: CarCardProps) {
  const psychology = getCardPsychology(car, index)

  return (
    <Link href={`/cars/${car.id}`}>
      <Card className="overflow-hidden border-zinc-800 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] transition-all duration-500 cursor-pointer h-full group bg-card/50 backdrop-blur relative">
        {/* Premium badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {psychology.isNew && (
            <Badge className="bg-primary/90 text-black border-0 shadow-lg backdrop-blur">
              <Zap className="h-3 w-3 mr-1" />
              NEW ARRIVAL
            </Badge>
          )}
          {psychology.isHot && (
            <Badge className="bg-zinc-900/90 text-primary border border-primary/30 shadow-lg backdrop-blur">
              <TrendingUp className="h-3 w-3 mr-1" />
              PREMIUM SELECT
            </Badge>
          )}
        </div>

        <div className="relative h-72 w-full overflow-hidden bg-black">
          <Image
            src={car.image}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Dynamic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

          {/* Condition badge */}
          <Badge className="absolute top-3 right-3 bg-black/90 backdrop-blur-sm text-primary border border-primary/30 shadow-lg">
            {car.condition}
          </Badge>

          {/* View count — hidden until real data available from Strapi */}
          {psychology.viewCount !== null && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-zinc-700">
              <Eye className="h-3 w-3 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-300">{psychology.viewCount} views</span>
            </div>
          )}

          {/* Condition indicator */}
          {psychology.isLowMileage && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary">
              <Clock className="h-3 w-3 text-black" />
              <span className="text-xs font-bold text-black">LOW MILEAGE</span>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-zinc-500 text-xs font-semibold mb-1 tracking-wider uppercase">{car.year} • {car.bodyType}</p>
              <h3 className="font-black text-2xl mb-2 group-hover:text-primary transition-colors leading-tight">
                {car.make}<br />{car.model}
              </h3>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
            <p className="text-xs text-zinc-500 mb-1 font-semibold uppercase">Price</p>
            <p className="text-3xl font-black text-primary">
              {formatPrice(car.price)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-zinc-400">
              <Gauge className="h-4 w-4 text-primary" />
              <span className="font-medium">{formatMileage(car.mileage)}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Fuel className="h-4 w-4 text-primary" />
              <span className="font-medium">{car.fuelType}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-bold py-3 px-4 rounded-lg text-center transition-all border border-primary/30 group-hover:border-primary">
            VIEW DETAILS →
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
