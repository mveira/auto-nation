import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Wrench, Shield, Clock, Phone } from "lucide-react"
import { Hero } from "@/components/Hero"
import { FadeInSection, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/AnimatedSection"
import { getAllServices, SERVICE_ICONS } from "@/services/services.service"

const yearsExp = process.env.NEXT_PUBLIC_YEARS_EXPERIENCE
const warrantyMonths = process.env.NEXT_PUBLIC_WARRANTY_MONTHS
const moneyBackDays = process.env.NEXT_PUBLIC_MONEYBACK_DAYS
const isProd = process.env.NODE_ENV === "production"
const bizPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE
const phone = bizPhone ?? (isProd ? null : "+441171234567")

function phoneTelHref(raw: string) {
  return `tel:${raw.replace(/\s+/g, "")}`
}

export default function HomePage() {
  const services = getAllServices()

  const whyUsItems = [
    yearsExp
      ? { icon: Wrench, title: `${yearsExp} Years Experience`, desc: `${yearsExp === "1" ? "A year" : yearsExp + " years"} of hands-on mechanical experience across all petrol and diesel makes.` }
      : null,
    warrantyMonths
      ? { icon: Shield, title: `${warrantyMonths} Month Warranty`, desc: `Every repair is backed by a ${warrantyMonths} month warranty${moneyBackDays ? ` and a ${moneyBackDays} day money-back guarantee` : ""}. No risk.` }
      : null,
    { icon: Clock, title: "Independent Garage", desc: "A local, independent garage in Fishponds. Fair pricing without the dealership markup." },
  ].filter(Boolean) as { icon: typeof Wrench; title: string; desc: string }[]

  return (
    <>
      <Hero />

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Why Us — elevated with card treatment */}
      <section className="py-20 md:py-28 px-4 bg-zinc-950/50 bg-noise relative overflow-hidden">
        {/* Subtle background image */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <img
            src="/images/garage-workshop.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-[0.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-transparent to-zinc-950/60" />
        </div>

        <div className="container mx-auto relative">
          <FadeInSection>
            <StaggerContainer className={`grid md:grid-cols-${whyUsItems.length} gap-8 max-w-4xl mx-auto`}>
              {whyUsItems.map((item) => (
                <StaggerItem key={item.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-5 border border-primary/20">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-black text-lg tracking-tighter mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed">{item.desc}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeInSection>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Service Highlights — with icons and depth */}
      <section className="relative py-20 md:py-28 px-4">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container mx-auto relative">
          <FadeInSection>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-center mb-4">
              Our <span className="text-primary">Services</span>
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto font-light">
              From routine servicing to complex repairs — clear pricing and honest advice.
            </p>
          </FadeInSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.slice(0, 4).map((service) => {
              const Icon = SERVICE_ICONS[service.slug] || Wrench
              return (
                <StaggerItem key={service.slug}>
                  <ScaleOnHover>
                    <Link
                      href={`/book?service=${service.slug}`}
                      className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <Card className="hover:border-primary/30 transition-all duration-300 h-full group">
                        <CardHeader className="p-5">
                          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary/20 transition-colors border border-primary/10">
                            <Icon className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-base tracking-tighter">{service.title}</CardTitle>
                          <CardDescription className="text-sm font-light line-clamp-2">
                            {service.shortDescription}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  </ScaleOnHover>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
          <FadeInSection delay={0.3}>
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
          </FadeInSection>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Closing CTA */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container mx-auto text-center relative">
          <FadeInSection>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Ready to <span className="text-primary">Book?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-4">
              Fair pricing, honest advice, and quality work — every time.
            </p>
            <p className="text-sm text-muted-foreground mb-10">
              Serving Fishponds and surrounding Bristol areas
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
                <Button size="lg" className="font-bold text-lg px-10 py-7">
                  Book Online
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {phone && (
                <a href={phoneTelHref(phone)}>
                  <Button size="lg" variant="outline" className="font-bold text-lg px-10 py-7 border-2 border-zinc-700 hover:border-primary">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Us
                  </Button>
                </a>
              )}
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  )
}
