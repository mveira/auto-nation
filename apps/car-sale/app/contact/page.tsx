"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Get WhatsApp number from environment variable
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "447700900123"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      let data
      try {
        data = await response.json()
      } catch (e) {
        throw new Error('Failed to process response')
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send message')
      }

      setSubmitStatus("success")

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", message: "" })
        setSubmitStatus("idle")
      }, 3000)
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.')

      // Reset error status after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle")
        setErrorMessage("")
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsApp = () => {
    const message = formData.name || formData.email || formData.message
      ? `Hi, I'd like to get in touch.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nMessage: ${formData.message}`
      : "Hi, I'd like to get in touch about a vehicle."

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-black via-zinc-900 to-black py-20 px-4 border-b border-zinc-800">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/30 px-6 py-2">
            <MessageCircle className="h-4 w-4 mr-2" />
            WE'RE HERE TO HELP
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            GET IN <span className="text-primary">TOUCH</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Speak to our specialist team for expert advice on your next vehicle
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact methods */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick contact cards */}
            <Card className="bg-zinc-900 border-zinc-800 hover:border-primary/30 transition-all group">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                  <MessageCircle className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-black mb-2">WhatsApp</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Instant response, available now
                </p>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold">
                    OPEN WHATSAPP
                  </Button>
                </a>
                <p className="text-xs text-zinc-500 mt-3 text-center">
                  Average response: <span className="text-primary font-bold">Under 2 min</span>
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-black mb-2">Call Us</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Speak directly to our team
                </p>
                <a href="tel:+447700900123" className="text-2xl font-black text-primary hover:text-primary/80 transition-colors">
                  07700 900123
                </a>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-black mb-3">Opening Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Monday - Friday</span>
                    <span className="text-white font-bold">9AM - 6PM</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Saturday</span>
                    <span className="text-white font-bold">9AM - 5PM</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Sunday</span>
                    <span className="text-white font-bold">By Appointment</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-black mb-2">Visit Us</h3>
                <p className="text-zinc-400 text-sm">
                  123 Fishponds Road<br />
                  Fishponds<br />
                  Bristol, UK<br />
                  BS16 3AN
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-3xl font-black">
                  SEND US A <span className="text-primary">MESSAGE</span>
                </CardTitle>
                <p className="text-zinc-400">
                  Fill out the form below and we'll get back to you within 2 hours
                </p>
              </CardHeader>
              <CardContent className="p-6">
                {submitStatus === "success" ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black mb-3">MESSAGE SENT!</h3>
                    <p className="text-zinc-400 mb-6">
                      We've received your message and will respond shortly.
                    </p>
                    <Button
                      onClick={() => setSubmitStatus("idle")}
                      variant="outline"
                      className="border-zinc-700"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : submitStatus === "error" ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="h-10 w-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-black mb-3">OOPS! SOMETHING WENT WRONG</h3>
                    <p className="text-zinc-400 mb-6">
                      {errorMessage || "Failed to send message. Please try again or contact us via WhatsApp."}
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => setSubmitStatus("idle")}
                        variant="outline"
                        className="border-zinc-700"
                      >
                        Try Again
                      </Button>
                      <Button
                        onClick={handleWhatsApp}
                        className="bg-primary hover:bg-primary/90 text-black font-bold"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp Us
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
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

                    <div>
                      <label className="text-sm font-bold mb-2 block tracking-wide">
                        YOUR MESSAGE *
                      </label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us what you're looking for..."
                        rows={6}
                        className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary hover:bg-primary/90 text-black font-black text-lg py-6"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                            SENDING...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            SEND MESSAGE
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        onClick={handleWhatsApp}
                        variant="outline"
                        className="flex-1 border-zinc-700 hover:border-primary text-lg py-6 font-bold"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        SEND VIA WHATSAPP
                      </Button>
                    </div>

                    <p className="text-xs text-zinc-500 text-center">
                      By submitting, you agree to our privacy policy and terms of service
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Trust signals */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-black text-primary mb-1">2 MIN</p>
                <p className="text-xs text-zinc-400">Average Response Time</p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-black text-primary mb-1">24/7</p>
                <p className="text-xs text-zinc-400">WhatsApp Support</p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
                {/* TODO: Wire to real customer count from Strapi */}
                <p className="text-2xl font-black text-primary mb-1">25+</p>
                <p className="text-xs text-zinc-400">Years in Business</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
