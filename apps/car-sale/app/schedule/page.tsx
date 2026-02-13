"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Car,
  User,
  Mail,
  Phone as PhoneIcon,
  MessageSquare,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

function ScheduleForm() {
  const searchParams = useSearchParams()
  const carInfo = searchParams.get('car')
  const carId = searchParams.get('id')
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    appointmentType: "Test Drive",
    date: "",
    time: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    
    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          carDetails: carInfo || undefined,
        }),
      })

      let data
      try {
        data = await response.json()
      } catch (e) {
        throw new Error('Failed to process response')
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to schedule appointment')
      }

      setSubmitStatus("success")
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : 'Failed to schedule appointment. Please try again.')
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle")
        setErrorMessage("")
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-black via-zinc-900 to-black py-20 px-4 border-b border-zinc-800">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/30 px-6 py-2">
            <Calendar className="h-4 w-4 mr-2" />
            BOOK YOUR APPOINTMENT
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            SCHEDULE A <span className="text-primary">VISIT</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Book a test drive or viewing at your convenience
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-12">
        {carId && (
          <div className="mb-6 flex justify-center">
            <Link 
              href={`/cars/${carId}`}
              className="inline-flex items-center text-sm hover:text-primary font-semibold transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              BACK TO VEHICLE
            </Link>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {/* Car info card if available */}
          {carInfo && (
            <Card className="bg-zinc-900 border-zinc-800 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-semibold uppercase">Vehicle of Interest</p>
                    <p className="text-lg font-black">{carInfo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appointment form */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-3xl font-black">
                BOOK YOUR <span className="text-primary">APPOINTMENT</span>
              </CardTitle>
              <p className="text-zinc-400">
                Fill out the form below and we'll confirm your appointment within 2 hours
              </p>
            </CardHeader>
            <CardContent className="p-6">
              {submitStatus === "success" ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">APPOINTMENT REQUESTED!</h3>
                  <p className="text-zinc-400 mb-6">
                    We've received your appointment request. We'll confirm the details with you shortly via email or phone.
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button
                      onClick={() => {
                        setSubmitStatus("idle")
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          appointmentType: "Test Drive",
                          date: "",
                          time: "",
                          message: "",
                        })
                      }}
                      variant="outline"
                      className="border-zinc-700"
                    >
                      Book Another Appointment
                    </Button>
                    <Link href="/inventory">
                      <Button className="bg-primary hover:bg-primary/90 text-black font-bold">
                        Browse Inventory
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : submitStatus === "error" ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">OOPS! SOMETHING WENT WRONG</h3>
                  <p className="text-zinc-400 mb-6">
                    {errorMessage || "Failed to schedule appointment. Please try again or contact us directly."}
                  </p>
                  <Button
                    onClick={() => setSubmitStatus("idle")}
                    variant="outline"
                    className="border-zinc-700"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      YOUR INFORMATION
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold mb-2 block tracking-wide">
                          YOUR NAME *
                        </label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Smith"
                          className="bg-black border-zinc-700 focus:border-primary h-12"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-2 block tracking-wide">
                          EMAIL ADDRESS *
                        </label>
                        <Input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="bg-black border-zinc-700 focus:border-primary h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold mb-2 block tracking-wide">
                        PHONE NUMBER *
                      </label>
                      <Input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="07700 900123"
                        className="bg-black border-zinc-700 focus:border-primary h-12"
                      />
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-4 pt-6 border-t border-zinc-800">
                    <h3 className="text-lg font-black flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      APPOINTMENT DETAILS
                    </h3>

                    <div>
                      <label className="text-sm font-bold mb-2 block tracking-wide">
                        APPOINTMENT TYPE *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, appointmentType: "Test Drive" })}
                          className={`p-4 rounded-lg border-2 font-bold transition-all ${
                            formData.appointmentType === "Test Drive"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-zinc-700 hover:border-zinc-600"
                          }`}
                        >
                          Test Drive
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, appointmentType: "Viewing" })}
                          className={`p-4 rounded-lg border-2 font-bold transition-all ${
                            formData.appointmentType === "Viewing"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-zinc-700 hover:border-zinc-600"
                          }`}
                        >
                          Viewing
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold mb-2 block tracking-wide">
                          PREFERRED DATE *
                        </label>
                        <Input
                          required
                          type="date"
                          min={today}
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="bg-black border-zinc-700 focus:border-primary h-12"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-2 block tracking-wide">
                          PREFERRED TIME *
                        </label>
                        <Input
                          required
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="bg-black border-zinc-700 focus:border-primary h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold mb-2 block tracking-wide">
                        ADDITIONAL NOTES (OPTIONAL)
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Any specific requirements or questions..."
                        rows={4}
                        className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-black font-black text-lg py-6"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                          SCHEDULING...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          SCHEDULE APPOINTMENT
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-zinc-500 text-center mt-4">
                      We'll confirm your appointment within 2 hours during business hours
                    </p>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Trust signals */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
              <p className="text-2xl font-black text-primary mb-1">2 HRS</p>
              <p className="text-xs text-zinc-400">Confirmation Time</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
              <p className="text-2xl font-black text-primary mb-1">FLEXIBLE</p>
              <p className="text-xs text-zinc-400">Easy Rescheduling</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
              <p className="text-2xl font-black text-primary mb-1">NO FEE</p>
              <p className="text-xs text-zinc-400">Free Test Drives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SchedulePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    }>
      <ScheduleForm />
    </Suspense>
  )
}
