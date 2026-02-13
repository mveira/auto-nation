"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  Car as CarIcon,
  User,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { getCars } from "@/services/cars.service"

export default function BookingPage() {
  const allCars = getCars()
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    carId: "",
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    bookingType: "test-drive",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const selectedCar = allCars.find(car => car.id === bookingData.carId)

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const carInfo = selectedCar ? `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}` : undefined
      
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          appointmentType: bookingData.bookingType === 'test-drive' ? 'Test Drive' : 'Viewing',
          date: bookingData.date,
          time: bookingData.time,
          carDetails: carInfo,
          message: '',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule appointment')
      }

      setSubmitStatus("success")
    } catch (error) {
      console.error('Booking error:', error)
      setSubmitStatus("error")
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle")
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "447123456789"

  const handleWhatsAppBooking = () => {
    const car = selectedCar ? `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}` : "Not selected"
    const message = `Hi, I'd like to book a ${bookingData.bookingType === 'test-drive' ? 'test drive' : 'viewing appointment'}.\n\nVehicle: ${car}\nName: ${bookingData.name}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nPhone: ${bookingData.phone}`
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank")
  }

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="bg-zinc-900 border-zinc-800 max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 rounded-full bg-green-500/10 border-4 border-green-500 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-4xl font-black mb-4">
              BOOKING <span className="text-primary">CONFIRMED!</span>
            </h2>
            <p className="text-zinc-400 mb-2">
              Your {bookingData.bookingType === 'test-drive' ? 'test drive' : 'viewing'} is scheduled for:
            </p>
            <p className="text-2xl font-bold text-primary mb-6">
              {bookingData.date} at {bookingData.time}
            </p>
            <p className="text-zinc-400 mb-8">
              We'll confirm your appointment at <span className="text-white font-bold">{bookingData.email}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/inventory">
                <Button variant="outline" className="border-zinc-700">
                  BROWSE MORE VEHICLES
                </Button>
              </Link>
              <Button
                onClick={() => {
                  setSubmitStatus("idle")
                  setStep(1)
                  setBookingData({
                    carId: "",
                    name: "",
                    email: "",
                    phone: "",
                    date: "",
                    time: "",
                    bookingType: "test-drive",
                  })
                }}
                className="bg-primary hover:bg-primary/90 text-black font-bold"
              >
                BOOK ANOTHER
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="bg-zinc-900 border-zinc-800 max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 rounded-full bg-red-500/10 border-4 border-red-500 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-4xl font-black mb-4">
              SOMETHING WENT <span className="text-red-500">WRONG</span>
            </h2>
            <p className="text-zinc-400 mb-8">
              We couldn't process your booking. Please try again or contact us via WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setSubmitStatus("idle")}
                variant="outline"
                className="border-zinc-700"
              >
                TRY AGAIN
              </Button>
              <Button
                onClick={handleWhatsAppBooking}
                className="bg-primary hover:bg-primary/90 text-black font-bold"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                BOOK VIA WHATSAPP
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-black via-zinc-900 to-black py-16 px-4 border-b border-zinc-800">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/30 px-6 py-2">
            <Calendar className="h-4 w-4 mr-2" />
            BOOK YOUR EXPERIENCE
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            SCHEDULE A <span className="text-primary">VISIT</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Book a test drive or viewing appointment at your convenience
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-8 max-w-4xl">
        {/* Progress steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black border-2 transition-all ${
                step >= s 
                  ? "bg-primary border-primary text-black" 
                  : "bg-zinc-900 border-zinc-700 text-zinc-500"
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 transition-all ${
                  step > s ? "bg-primary" : "bg-zinc-800"
                }`}></div>
              )}
            </div>
          ))}
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-black">
              {step === 1 && "SELECT VEHICLE"}
              {step === 2 && "CHOOSE DATE & TIME"}
              {step === 3 && "YOUR DETAILS"}
            </CardTitle>
            <p className="text-zinc-400 text-sm">
              {step === 1 && "Choose the vehicle you'd like to see"}
              {step === 2 && "Pick your preferred date and time slot"}
              {step === 3 && "Provide your contact information"}
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Select Car */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold mb-3 block tracking-wide">
                      BOOKING TYPE
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, bookingType: "test-drive" })}
                        className={`p-6 rounded-lg border-2 transition-all text-left ${
                          bookingData.bookingType === "test-drive"
                            ? "border-primary bg-primary/10"
                            : "border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <CarIcon className="h-8 w-8 text-primary mb-3" />
                        <h3 className="font-black mb-1">Test Drive</h3>
                        <p className="text-xs text-zinc-400">Experience the vehicle on road</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, bookingType: "viewing" })}
                        className={`p-6 rounded-lg border-2 transition-all text-left ${
                          bookingData.bookingType === "viewing"
                            ? "border-primary bg-primary/10"
                            : "border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <Clock className="h-8 w-8 text-primary mb-3" />
                        <h3 className="font-black mb-1">Viewing</h3>
                        <p className="text-xs text-zinc-400">Inspect vehicle at showroom</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold mb-3 block tracking-wide">
                      SELECT VEHICLE
                    </label>
                    <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                      {allCars.slice(0, 12).map((car) => (
                        <button
                          key={car.id}
                          type="button"
                          onClick={() => setBookingData({ ...bookingData, carId: car.id })}
                          className={`flex gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                            bookingData.carId === car.id
                              ? "border-primary bg-primary/10"
                              : "border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0 bg-zinc-950">
                            <Image
                              src={car.image}
                              alt={`${car.make} ${car.model}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-zinc-500 mb-1">{car.year}</p>
                            <p className="font-bold text-sm truncate">
                              {car.make} {car.model}
                            </p>
                            <p className="text-xs text-primary font-bold">
                              £{car.price.toLocaleString()}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 mt-3">
                      Don't see your car? <a href={`https://wa.me/${whatsappNumber}`} className="text-primary hover:underline">Contact us</a>
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!bookingData.carId}
                    className="w-full bg-primary hover:bg-primary/90 text-black font-black text-lg py-6"
                  >
                    CONTINUE TO DATE & TIME
                  </Button>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="space-y-6">
                  {selectedCar && (
                    <div className="flex items-center gap-4 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                      <div className="relative w-20 h-14 rounded overflow-hidden">
                        <Image
                          src={selectedCar.image}
                          alt={`${selectedCar.make} ${selectedCar.model}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Selected Vehicle</p>
                        <p className="font-bold">{selectedCar.year} {selectedCar.make} {selectedCar.model}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-bold mb-3 block tracking-wide">
                      PREFERRED DATE
                    </label>
                    <Input
                      required
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="bg-black border-zinc-700 focus:border-primary h-12"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold mb-3 block tracking-wide">
                      PREFERRED TIME
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setBookingData({ ...bookingData, time })}
                          className={`p-3 rounded-lg border-2 transition-all font-bold ${
                            bookingData.time === time
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1 border-zinc-700"
                    >
                      BACK
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!bookingData.date || !bookingData.time}
                      className="flex-1 bg-primary hover:bg-primary/90 text-black font-black"
                    >
                      CONTINUE
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Details */}
              {step === 3 && (
                <div className="space-y-6">
                  {selectedCar && (
                    <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-4">
                      <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Your Booking Summary</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-zinc-500">Vehicle</p>
                          <p className="font-bold">{selectedCar.year} {selectedCar.make} {selectedCar.model}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Type</p>
                          <p className="font-bold capitalize">{bookingData.bookingType.replace('-', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Date</p>
                          <p className="font-bold text-primary">{bookingData.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Time</p>
                          <p className="font-bold text-primary">{bookingData.time}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold mb-2 block tracking-wide">
                        YOUR NAME *
                      </label>
                      <Input
                        required
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        placeholder="John Smith"
                        className="bg-black border-zinc-700 focus:border-primary h-12"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold mb-2 block tracking-wide">
                        EMAIL *
                      </label>
                      <Input
                        required
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
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
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                      placeholder="07123 456789"
                      className="bg-black border-zinc-700 focus:border-primary h-12"
                    />
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-bold text-primary mb-1">Please bring:</p>
                        <ul className="text-zinc-300 space-y-1 text-xs">
                          <li>• Valid driving license (for test drives)</li>
                          <li>• Proof of address</li>
                          <li>• Insurance details (if test driving)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="border-zinc-700"
                    >
                      BACK
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-primary hover:bg-primary/90 text-black font-black text-lg py-6"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                          CONFIRMING...
                        </>
                      ) : (
                        <>
                          <Calendar className="mr-2 h-5 w-5" />
                          CONFIRM BOOKING
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleWhatsAppBooking}
                      variant="outline"
                      className="border-zinc-700 hover:border-primary font-bold"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      BOOK VIA WHATSAPP
                    </Button>
                  </div>

                  <p className="text-xs text-zinc-500 text-center">
                    By booking, you agree to our terms and conditions
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Trust signals */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-primary mb-1">100%</p>
            <p className="text-xs text-zinc-400">Free Cancellation</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-primary mb-1">NO</p>
            <p className="text-xs text-zinc-400">Obligations</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-primary mb-1">INSTANT</p>
            <p className="text-xs text-zinc-400">Confirmation</p>
          </div>
        </div>
      </div>
    </div>
  )
}
