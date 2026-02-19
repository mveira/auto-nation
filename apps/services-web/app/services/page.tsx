import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { getAllServices } from "@/services/services.service"

export const metadata = {
  title: "Our Services - Car Nation Services",
  description: "Full servicing, MOT testing, brake repairs, tyre fitting, diagnostics, and more.",
}

export default function ServicesPage() {
  const services = getAllServices()

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-center mb-4">
          Our <span className="text-primary">Services</span>
        </h1>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto font-light">
          From routine servicing to complex repairs, we handle it all. Clear pricing and honest advice on every job.
        </p>

        <div className="grid gap-6">
          {services.map((service) => (
            <Card key={service.slug} className="hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.shortDescription}
                    </CardDescription>
                  </div>
                  <Link href="/book" className="flex-shrink-0">
                    <Button size="sm" className="font-bold">
                      Book
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

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
      </div>
    </section>
  )
}
