import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Wrench, Shield, Clock } from "lucide-react"
import { Hero } from "@/components/Hero"
import { getAllServices } from "@/services/services.service"

export default function HomePage() {
  const services = getAllServices()

  return (
    <>
      <Hero />

      {/* Why Us */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">20 Years Experience</h3>
              <p className="text-muted-foreground text-sm font-light">
                Two decades of hands-on mechanical experience across all petrol and diesel makes.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">3 Month Repair Warranty</h3>
              <p className="text-muted-foreground text-sm font-light">
                Every repair is backed by a 3 month warranty and a 30 day money-back guarantee. No risk.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Independent Bristol Garage</h3>
              <p className="text-muted-foreground text-sm font-light">
                A local, independent garage in Fishponds. Fair pricing without the dealership markup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-12">
            Our <span className="text-primary">Services</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/book?service=${service.slug}`}
                className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/book">
              <Button size="lg" className="font-bold">
                Book a Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
