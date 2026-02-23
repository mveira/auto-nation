import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, ShieldCheck, Timer, MapPin, Phone, Star } from "lucide-react"

const isProd = process.env.NODE_ENV === "production"

const bizPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE
const reviewRating = process.env.NEXT_PUBLIC_REVIEW_RATING
const reviewCount = process.env.NEXT_PUBLIC_REVIEW_COUNT
const yearsExp = process.env.NEXT_PUBLIC_YEARS_EXPERIENCE
const warrantyMonths = process.env.NEXT_PUBLIC_WARRANTY_MONTHS
const moneyBackDays = process.env.NEXT_PUBLIC_MONEYBACK_DAYS

const phone = bizPhone ?? (isProd ? null : "+441171234567")
const hasReviews = reviewRating && reviewCount

const trustItems = [
  yearsExp ? { icon: ShieldCheck, label: `${yearsExp} Years Experience` } : null,
  warrantyMonths ? { icon: CheckCircle2, label: `${warrantyMonths} Month Repair Warranty` } : null,
  moneyBackDays ? { icon: Timer, label: `${moneyBackDays}-Day Money-Back Promise*` } : null,
  { icon: MapPin, label: "Independent Bristol Garage" },
].filter(Boolean) as { icon: typeof ShieldCheck; label: string }[]

function phoneTelHref(raw: string) {
  return `tel:${raw.replace(/\s+/g, "")}`
}

function HeroVisual() {
  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-6 duration-600 delay-150 fill-mode-both">
      {/* Radial gold glow behind image */}
      <div
        className="absolute inset-0 rounded-2xl scale-95 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Image container */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg shadow-primary/5 border border-border">
        <Image
          src="/images/service-hero.jpg"
          alt="Qualified mechanic servicing a vehicle in a professional garage"
          width={800}
          height={600}
          priority
          className="w-full h-auto object-cover"
        />

        {/* Bottom gradient fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Trust badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm border border-primary/20 rounded-xl px-3 py-2">
          <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-xs font-semibold text-zinc-200">Local Independent Garage</span>
        </div>
      </div>

      {/* Mini stats row below image */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-5 px-1">
        {yearsExp && (
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-black text-primary">{yearsExp}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Years Experience</p>
        </div>
        )}
        <div className="text-center border-x border-border">
          <p className="text-xl sm:text-2xl font-black text-primary">6</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Core Services</p>
        </div>
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-black text-primary">All</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Petrol &amp; Diesel</p>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-28">
        {/* Desktop: 2-column grid. Mobile: single column with order control. */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* Block 1: Headline + Description (always first) */}
          <div className="order-1 animate-in fade-in slide-in-from-bottom-6 duration-600 fill-mode-both">
            <span className="inline-block text-sm font-semibold text-primary tracking-wide uppercase mb-3">
              Expert Car Repairs in Fishponds, Bristol
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] lg:leading-[1.1] mb-4">
              Reliable Car Servicing{" "}
              <span className="relative inline-block">
                <span className="relative z-10">&amp; Repairs</span>
                <span
                  className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -skew-x-3 rounded-sm"
                  aria-hidden="true"
                />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground font-light mb-2 max-w-lg">
              Clear pricing agreed before work starts{warrantyMonths ? ` — backed by a ${warrantyMonths} month warranty on repairs` : ""}. No surprises.
            </p>
            {moneyBackDays && (
            <p className="text-xs text-muted-foreground max-w-lg">
              *Promise applies to workmanship on completed repairs. Terms apply.
            </p>
            )}
          </div>

          {/* Block 2: Visual — between description and CTAs on mobile, right column on desktop */}
          <div className="order-2 my-8 lg:my-0 lg:row-span-3">
            <HeroVisual />
          </div>

          {/* Block 3: CTAs + Trust (below visual on mobile, continues left column on desktop) */}
          <div className="order-3 animate-in fade-in slide-in-from-bottom-6 duration-600 fill-mode-both">
            {/* CTAs */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 mb-8">
              <Link href="/book">
                <Button size="lg" className="font-bold text-base w-full sm:w-auto">
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {phone && (
                <a href={phoneTelHref(phone)}>
                  <Button size="lg" variant="outline" className="font-bold text-base w-full sm:w-auto">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>
                </a>
              )}
            </div>

            {/* Social proof — only rendered when real review data is configured */}
            {hasReviews && (
              <div className="flex items-center gap-1.5 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
                <span className="ml-1.5 text-sm font-semibold">{reviewRating}/5</span>
                <span className="text-sm text-muted-foreground">Google Rating</span>
              </div>
            )}

            {/* Trust stack */}
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              {trustItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              Serving Fishponds and surrounding Bristol areas.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
