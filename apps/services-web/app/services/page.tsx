import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wrench } from "lucide-react"
import Link from "next/link"
import { getAllServices, SERVICE_ICONS } from "@/services/services.service"
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection"

export const metadata = {
  title: "Our Services - Car Nation Services",
  description: "Full servicing, MOT testing, brake repairs, tyre fitting, diagnostics, and more.",
}

export default function ServicesPage() {
  const services = getAllServices()

  return (
    <section className="relative py-20 md:py-28 px-4">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-4xl relative">
        <FadeInSection>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-4">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto font-light">
            From routine servicing to complex repairs, we handle it all. Clear pricing and honest advice on every job.
          </p>
        </FadeInSection>

        <StaggerContainer className="grid gap-5">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.slug] || Wrench
            return (
              <StaggerItem key={service.slug}>
                <Card className="hover:border-primary/30 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary flex-shrink-0 border border-primary/10 group-hover:bg-primary/20 transition-colors mt-0.5">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl tracking-tighter mb-2">{service.title}</CardTitle>
                          <CardDescription className="text-base font-light">
                            {service.shortDescription}
                          </CardDescription>
                        </div>
                      </div>
                      <Link href={`/book?service=${service.slug}`} className="flex-shrink-0">
                        <Button size="sm" className="font-bold">
                          Book
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        <FadeInSection delay={0.2}>
          <div className="text-center mt-12">
            <p className="text-muted-foreground text-sm mb-4">
              Need something not listed? Get in touch and we'll help.
            </p>
            <Link href="/contact">
              <Button variant="outline" className="font-bold">
                Contact Us
              </Button>
            </Link>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}
