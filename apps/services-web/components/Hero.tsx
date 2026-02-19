import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, ShieldCheck, Timer, MapPin } from "lucide-react"

const trustItems = [
  { icon: ShieldCheck, label: "Qualified Technicians" },
  { icon: CheckCircle2, label: "Transparent Pricing" },
  { icon: Timer, label: "Fast Turnaround" },
  { icon: MapPin, label: "Local & Trusted" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-in { animation: heroFadeUp 0.6s ease-out both; }
        .hero-fade-in-delayed { animation: heroFadeUp 0.6s ease-out 0.15s both; }
      `}} />
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Content */}
          <div className="hero-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Reliable Car Servicing{" "}
              <span className="relative inline-block">
                <span className="relative z-10">& Repairs</span>
                <span
                  className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -skew-x-3 rounded-sm"
                  aria-hidden="true"
                />
              </span>{" "}
              <span className="text-muted-foreground font-light text-3xl md:text-4xl lg:text-5xl block mt-2">
                Without the Stress
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground font-light mb-8 max-w-lg">
              Clear pricing before we start. Honest advice on what actually needs doing.
              Quality parts, experienced hands, and your car back on the road fast.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/book">
                <Button size="lg" className="font-bold text-base w-full sm:w-auto">
                  Book a Service
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="font-bold text-base w-full sm:w-auto">
                  Get a Free Quote
                </Button>
              </Link>
            </div>

            {/* Trust stack */}
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              {trustItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual */}
          <div className="relative hero-fade-in-delayed mt-8 lg:mt-0">
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
                <span className="text-xs font-semibold text-zinc-200">Trusted Local Garage</span>
              </div>
            </div>

            {/* Mini stats row below image */}
            <div className="grid grid-cols-3 gap-4 mt-5 px-1">
              <div className="text-center">
                <p className="text-2xl font-black text-primary">6</p>
                <p className="text-xs text-muted-foreground">Core Services</p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-2xl font-black text-primary">MOT</p>
                <p className="text-xs text-muted-foreground">Testing Centre</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-primary">All</p>
                <p className="text-xs text-muted-foreground">Makes & Models</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
