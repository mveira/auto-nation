"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { getAllServices } from "@/services/services.service"

export default function BookPage() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const searchParams = useSearchParams()
  const services = getAllServices()

  const serviceSlug = searchParams.get("service")
  const preselected = services.find((s) => s.slug === serviceSlug)
  const defaultService = preselected ? preselected.title : ""

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState("sending")

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      service: (form.elements.namedItem("service") as HTMLSelectElement).value,
      vehicle: (form.elements.namedItem("vehicle") as HTMLInputElement).value,
      registration: (form.elements.namedItem("registration") as HTMLInputElement).value,
      preferredDate: (form.elements.namedItem("preferredDate") as HTMLInputElement).value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch("/api/book", {
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
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-center mb-4">
          Book a <span className="text-primary">Service</span>
        </h1>
        <p className="text-muted-foreground text-center mb-12 font-light">
          Fill in the form below and we'll confirm your booking.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>
              We'll get back to you to confirm availability and final pricing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="book-name" className="sr-only">Your name</label>
                <Input id="book-name" name="name" placeholder="Your name" required />
              </div>
              <div>
                <label htmlFor="book-email" className="sr-only">Email address</label>
                <Input id="book-email" name="email" type="email" placeholder="Email address" required />
              </div>
              <div>
                <label htmlFor="book-phone" className="sr-only">Phone number</label>
                <Input id="book-phone" name="phone" type="tel" placeholder="Phone number" required />
              </div>

              <div>
                <label htmlFor="book-service" className="sr-only">Service required</label>
                <select
                  id="book-service"
                  name="service"
                  required
                  defaultValue={defaultService}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&:invalid]:text-muted-foreground"
                >
                  <option value="" disabled>Select a service</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="book-vehicle" className="sr-only">Vehicle</label>
                <Input id="book-vehicle" name="vehicle" placeholder="Vehicle (e.g. 2019 Ford Focus)" required />
              </div>
              <div>
                <label htmlFor="book-registration" className="sr-only">Registration number</label>
                <Input id="book-registration" name="registration" placeholder="Registration number" />
              </div>
              <div>
                <label htmlFor="book-date" className="sr-only">Preferred date</label>
                <Input id="book-date" name="preferredDate" type="date" aria-label="Preferred date" />
              </div>

              <div>
                <label htmlFor="book-notes" className="sr-only">Additional notes</label>
                <textarea
                  id="book-notes"
                  name="notes"
                  placeholder="Any additional details or symptoms?"
                  rows={3}
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {formState === "sent" && (
                <p className="text-sm text-green-500 font-medium">
                  Booking request sent. We'll confirm your appointment shortly.
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
                {formState === "sending" ? "Sending..." : "Request Booking"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
