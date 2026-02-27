import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { getAllServices, getServiceBySlug, SERVICE_ICONS } from "@/services/services.service"
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection"

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllServices().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return {}
  return {
    title: `${service.title} - Car Nation Services`,
    description: service.shortDescription,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const Icon = SERVICE_ICONS[service.slug] || Wrench

  return (
    <section className="relative py-20 md:py-28 px-4">
      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-3xl relative">
        <FadeInSection>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Icon className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-4">
            {service.title}
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto font-light text-lg">
            {service.shortDescription}
          </p>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <Card className="mb-10">
            <CardHeader>
              <CardTitle className="text-xl tracking-tighter">What&apos;s Included</CardTitle>
              <CardDescription>Everything covered in this service.</CardDescription>
            </CardHeader>
            <CardContent>
              <StaggerContainer>
                <ul className="space-y-3">
                  {service.includes.map((item) => (
                    <StaggerItem key={item}>
                      <li className="flex items-start gap-3 text-sm font-light">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    </StaggerItem>
                  ))}
                </ul>
              </StaggerContainer>
            </CardContent>
          </Card>
        </FadeInSection>

        <FadeInSection delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="font-bold">
              <Link href={`/book?service=${service.slug}`}>
                Book This Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="font-bold">
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}
