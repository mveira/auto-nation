export interface Service {
  title: string
  slug: string
  shortDescription: string
}

const SERVICES: Service[] = [
  {
    title: "Full Service",
    slug: "full-service",
    shortDescription: "Comprehensive vehicle service covering all major checks, fluid top-ups, and filter replacements.",
  },
  {
    title: "Interim Service",
    slug: "interim-service",
    shortDescription: "Essential maintenance check for vehicles between full services. Oil change, brake check, and safety inspection.",
  },
  {
    title: "MOT Testing",
    slug: "mot-testing",
    shortDescription: "Annual MOT test to ensure your vehicle meets road safety and environmental standards.",
  },
  {
    title: "Brake Repairs",
    slug: "brake-repairs",
    shortDescription: "Disc and pad replacement, brake fluid change, and full braking system diagnostics.",
  },
  {
    title: "Tyre Fitting",
    slug: "tyre-fitting",
    shortDescription: "New tyre supply and fitting, wheel balancing, and tyre pressure checks for all vehicle types.",
  },
  {
    title: "Diagnostics",
    slug: "diagnostics",
    shortDescription: "Engine management light investigation and full electronic diagnostics using dealer-level equipment.",
  },
]

export function getAllServices(): Service[] {
  return SERVICES
}

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug)
}
