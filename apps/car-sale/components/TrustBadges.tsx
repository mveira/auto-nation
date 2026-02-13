import { Shield, Award, Users, Clock } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: Clock,
      title: "25+ YEARS",
      description: "In Business",
    },
    {
      icon: Users,
      title: "5,000+",
      description: "Happy Customers",
    },
    {
      icon: Award,
      title: "QUALITY",
      description: "Assured",
    },
    {
      icon: Shield,
      title: "WARRANTY",
      description: "Included",
    },
  ]

  return (
    <div className="bg-zinc-900 py-16 px-4 border-y border-zinc-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors border border-primary/20">
                <badge.icon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-black text-xl mb-1 tracking-tight">{badge.title}</h3>
              <p className="text-sm text-zinc-400 font-light">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
