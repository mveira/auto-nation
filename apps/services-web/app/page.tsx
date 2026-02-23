import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Wrench, Shield, Clock } from "lucide-react"
import { Hero } from "@/components/Hero"
import { getAllServices } from "@/services/services.service"

const yearsExp = process.env.NEXT_PUBLIC_YEARS_EXPERIENCE
const warrantyMonths = process.env.NEXT_PUBLIC_WARRANTY_MONTHS
const moneyBackDays = process.env.NEXT_PUBLIC_MONEYBACK_DAYS

export default function HomePage() {
  const services = getAllServices()

  const whyUsItems = [
    yearsExp
      ? { icon: Wrench, title: `${yearsExp} Years Experience`, desc: `${yearsExp === "1" ? "A year" : yearsExp + " years"} of hands-on mechanical experience across all petrol and diesel makes.` }
      : null,
    warrantyMonths
      ? { icon: Shield, title: `${warrantyMonths} Month Repair Warranty`, desc: `Every repair is backed by a ${warrantyMonths} month warranty${moneyBackDays ? ` and a ${moneyBackDays} day money-back guarantee` : ""}. No risk.` }
      : null,
    { icon: Clock, title: "Independent Bristol Garage", desc: "A local, independent garage in Fishponds. Fair pricing without the dealership markup." },
  ].filter(Boolean) as { icon: typeof Wrench; title: string; desc: string }[]

  return (
    <>
      <Hero />

      {/* Why Us */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className={`grid md:grid-cols-${whyUsItems.length} gap-8`}>
            {whyUsItems.map((item) => (
              <div key={item.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-12">
            Our <span className="text-primary">Services</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.slice(0, 4).map((service) => (
              <Link
                key={service.slug}
                href={`/book?service=${service.slug}`}
                className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Card className="hover:border-primary/30 hover:-translate-y-1 transition-all duration-200 h-full">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{service.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {service.shortDescription}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/services">
              <Button size="lg" variant="outline" className="font-bold">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/book">
              <Button size="lg" className="font-bold">
                Book a Service
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
