import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { getAllServices, getServiceBySlug } from "@/services/services.service"

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

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-center mb-4">
          {service.title}
        </h1>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto font-light text-lg">
          {service.shortDescription}
        </p>

        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-xl">What&apos;s Included</CardTitle>
            <CardDescription>Everything covered in this service.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

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
      </div>
    </section>
  )
}
