"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin } from "lucide-react"

const isProd = process.env.NODE_ENV === "production"

const bizPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE
const bizEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL
const bizStreet = process.env.NEXT_PUBLIC_BUSINESS_STREET
const bizCity = process.env.NEXT_PUBLIC_BUSINESS_CITY
const bizPostcode = process.env.NEXT_PUBLIC_BUSINESS_POSTCODE

const devPhone = "07700 900123"
const devEmail = "services@carnation.co.uk"
const devStreet = "123 Fishponds Road"
const devCity = "Fishponds, Bristol"
const devPostcode = "BS16 3AN"

const phone = bizPhone ?? (isProd ? null : devPhone)
const email = bizEmail ?? (isProd ? null : devEmail)
const street = bizStreet ?? (isProd ? null : devStreet)
const city = bizCity ?? (isProd ? null : devCity)
const postcode = bizPostcode ?? (isProd ? null : devPostcode)

function phoneTelHref(raw: string) {
  return `tel:${raw.replace(/\s+/g, "")}`
}

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState("sending")

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setFormState("sent")
        form.reset()
      } else {
        setFormState("error")
      }
    } catch {
      setFormState("error")
    }
  }

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-center mb-4">
          Get In <span className="text-primary">Touch</span>
        </h1>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto font-light">
          Have a question or need a quote? Drop us a message and we'll get back to you.
        </p>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-6">
            {phone && (
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Phone</h3>
                  <a href={phoneTelHref(phone)} className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    {phone}
                  </a>
                </div>
              </div>
            )}
            {email && (
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <a href={`mailto:${email}`} className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    {email}
                  </a>
                </div>
              </div>
            )}
            {street && city && postcode && (
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Address</h3>
                  <p className="text-muted-foreground text-sm">
                    {street}<br />
                    {city}<br />
                    {postcode}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>We aim to respond within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="sr-only">Your name</label>
                  <Input id="contact-name" name="name" placeholder="Your name" required />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">Email address</label>
                  <Input id="contact-email" name="email" type="email" placeholder="Email address" required />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="sr-only">Phone number</label>
                  <Input id="contact-phone" name="phone" type="tel" placeholder="Phone number" required />
                </div>
                <div>
                  <label htmlFor="contact-message" className="sr-only">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="How can we help?"
                    required
                    rows={4}
                    className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {formState === "sent" && (
                  <p className="text-sm text-green-500 font-medium">
                    Message sent. We'll be in touch.
                  </p>
                )}
                {formState === "error" && (
                  <p className="text-sm text-red-500 font-medium">
                    Something went wrong. Please try again or call us directly.
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full font-bold"
                  disabled={formState === "sending"}
                >
                  {formState === "sending" ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
