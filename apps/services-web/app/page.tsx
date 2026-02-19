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
              <h3 className="font-bold text-lg mb-2">Quality Work</h3>
              <p className="text-muted-foreground text-sm font-light">
                Experienced technicians using quality parts. Every job done properly, first time.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Transparent Pricing</h3>
              <p className="text-muted-foreground text-sm font-light">
                No hidden fees. We explain what needs doing and give you a clear price before any work starts.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Convenient Booking</h3>
              <p className="text-muted-foreground text-sm font-light">
                Book online or call us. We work around your schedule to keep you on the road.
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
              <Card key={service.slug} className="hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.shortDescription}</CardDescription>
                </CardHeader>
              </Card>
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
