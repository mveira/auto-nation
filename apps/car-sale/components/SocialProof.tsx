import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function SocialProof() {
  const testimonials = [
    {
      name: "James M.",
      car: "Porsche 911",
      rating: 5,
      text: "Exceptional service. Found my dream car and the team made the entire process seamless.",
      verified: true,
    },
    {
      name: "Sarah L.",
      car: "BMW M3",
      rating: 5,
      text: "Best car buying experience I've had. Transparent, professional, and the car is perfect.",
      verified: true,
    },
    {
      name: "Michael R.",
      car: "Audi RS6",
      rating: 5,
      text: "These guys know their cars. No pressure, just genuine passion and expertise.",
      verified: true,
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-zinc-900 to-black border-y border-zinc-800">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/30 px-6 py-3 rounded-full mb-6">
            <Star className="h-5 w-5 text-primary fill-primary" />
            <span className="font-black text-xl">4.9 OUT OF 5</span>
            <Star className="h-5 w-5 text-primary fill-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
            TRUSTED BY <span className="text-primary">ENTHUSIASTS</span>
          </h2>
          <p className="text-zinc-400 text-lg">Over 5,000 satisfied customers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-zinc-900/50 border-zinc-800 backdrop-blur hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                  ))}
                </div>
                
                <Quote className="h-8 w-8 text-primary/20 mb-3" />
                
                <p className="text-zinc-300 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-zinc-500">Purchased: {testimonial.car}</p>
                  </div>
                  {testimonial.verified && (
                    <div className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded border border-green-500/30">
                      VERIFIED
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-zinc-500 text-sm">
            Read all reviews on{" "}
            <a href="#" className="text-primary hover:underline font-semibold">
              Trustpilot
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
