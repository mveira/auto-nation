"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { getAllServices } from "@/services/services.service"
import { FadeInSection } from "@/components/AnimatedSection"
import { VehicleLookup } from "@/components/VehicleLookup"
import type { VehicleData } from "@/lib/dvla"

export default function BookClient() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [vehicle, setVehicle] = useState<VehicleData | null>(null)
  const searchParams = useSearchParams()
  const services = getAllServices()

  const serviceSlug = searchParams.get("service")
  const preselected = services.find((s) => s.slug === serviceSlug)
  const defaultService = preselected ? preselected.title : ""

  function handleVehicleConfirm(v: VehicleData) {
    setVehicle(v)
  }

  function handleVehicleReset() {
    setVehicle(null)
  }

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
        setVehicle(null)
        form.reset()
      } else {
        setFormState("error")
      }
    } catch {
      setFormState("error")
    }
  }

  // Build the vehicle description string for the hidden field
  const vehicleDescription = vehicle
    ? `${vehicle.yearOfManufacture ?? ""} ${vehicle.make} — ${vehicle.colour}, ${vehicle.fuelType}${vehicle.engineCapacity ? `, ${vehicle.engineCapacity}cc` : ""}`.trim()
    : ""

  return (
    <section className="py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-2xl">
        <FadeInSection>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-4">
            Book a <span className="text-primary">Service</span>
          </h1>
          <p className="text-muted-foreground text-center mb-12 font-light">
            Fill in the form below and we&apos;ll confirm your booking.
          </p>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>
                We&apos;ll get back to you to confirm availability and final pricing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Vehicle lookup — replaces manual vehicle + registration fields */}
                <div className="pb-2">
                  <VehicleLookup
                    onConfirm={handleVehicleConfirm}
                    onReset={handleVehicleReset}
                  />
                  {/* Hidden fields carry the confirmed vehicle data into the form submission */}
                  <input type="hidden" name="vehicle" value={vehicleDescription} />
                  <input type="hidden" name="registration" value={vehicle?.vrm ?? ""} />
                </div>

                <div>
                  <label htmlFor="book-name" className="block text-sm font-bold tracking-wide uppercase mb-1.5">Name</label>
                  <Input id="book-name" name="name" placeholder="Your name" required className="bg-black border-zinc-700 focus:border-primary h-12" />
                </div>
                <div>
                  <label htmlFor="book-email" className="block text-sm font-bold tracking-wide uppercase mb-1.5">Email</label>
                  <Input id="book-email" name="email" type="email" placeholder="Email address" required className="bg-black border-zinc-700 focus:border-primary h-12" />
                </div>
                <div>
                  <label htmlFor="book-phone" className="block text-sm font-bold tracking-wide uppercase mb-1.5">Phone</label>
                  <Input id="book-phone" name="phone" type="tel" placeholder="Phone number" required className="bg-black border-zinc-700 focus:border-primary h-12" />
                </div>

                <div>
                  <label htmlFor="book-service" className="block text-sm font-bold tracking-wide uppercase mb-1.5">Service</label>
                  <select
                    id="book-service"
                    name="service"
                    required
                    defaultValue={defaultService}
                    className="flex h-12 w-full rounded-xl border border-zinc-700 bg-black px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary [&:invalid]:text-muted-foreground"
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
                  <label htmlFor="book-date" className="block text-sm font-bold tracking-wide uppercase mb-1.5">Preferred Date</label>
                  <Input id="book-date" name="preferredDate" type="date" className="bg-black border-zinc-700 focus:border-primary h-12" />
                </div>

                <div>
                  <label htmlFor="book-notes" className="block text-sm font-bold tracking-wide uppercase mb-1.5">Notes</label>
                  <textarea
                    id="book-notes"
                    name="notes"
                    placeholder="Any additional details or symptoms?"
                    rows={3}
                    className="flex w-full rounded-xl border border-zinc-700 bg-black px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary"
                  />
                </div>

                {formState === "sent" && (
                  <p className="text-sm text-green-500 font-medium">
                    Booking request sent. We&apos;ll confirm your appointment shortly.
                  </p>
                )}
                {formState === "error" && (
                  <p className="text-sm text-red-500 font-medium">
                    Something went wrong. Please try again or call us directly.
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full font-bold text-lg py-6"
                  disabled={formState === "sending"}
                >
                  {formState === "sending" ? "Sending..." : "Request Booking"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </FadeInSection>
      </div>
    </section>
  )
}
