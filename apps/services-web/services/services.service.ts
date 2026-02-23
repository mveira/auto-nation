export interface Service {
  title: string
  slug: string
  shortDescription: string
  includes: string[]
}

const SERVICES: Service[] = [
  {
    title: "Full Service",
    slug: "full-service",
    shortDescription: "Comprehensive vehicle service covering all major checks, fluid top-ups, and filter replacements.",
    includes: [
      "Engine oil and filter change",
      "Air filter check/replacement",
      "Brake inspection",
      "Fluid top-ups (coolant, washer, brake)",
      "Tyre condition and pressure check",
      "Battery health check",
      "Lights and electrics inspection",
    ],
  },
  {
    title: "Interim Service",
    slug: "interim-service",
    shortDescription: "Essential maintenance check for vehicles between full services. Oil change, brake check, and safety inspection.",
    includes: [
      "Engine oil and filter change",
      "Visual brake inspection",
      "Tyre condition and pressure check",
      "Fluid level checks",
      "Lights and wiper check",
    ],
  },
  {
    title: "MOT Testing",
    slug: "mot-testing",
    shortDescription: "Annual MOT test to ensure your vehicle meets road safety and environmental standards. MOT certification currently in progress.",
    includes: [
      "Full MOT inspection to DVSA standards",
      "Emissions testing",
      "Brake efficiency test",
      "Lights, steering, and suspension checks",
      "Advisory notes for future attention",
    ],
  },
  {
    title: "Brake Repairs",
    slug: "brake-repairs",
    shortDescription: "Disc and pad replacement, brake fluid change, and full braking system diagnostics.",
    includes: [
      "Brake pad replacement",
      "Brake disc inspection and replacement",
      "Brake fluid check and change",
      "Handbrake adjustment",
      "Full braking system diagnostic",
    ],
  },
  {
    title: "Tyre Fitting",
    slug: "tyre-fitting",
    shortDescription: "New tyre supply and fitting, wheel balancing, and tyre pressure checks for all vehicle types.",
    includes: [
      "New tyre supply and fitting",
      "Wheel balancing",
      "Tyre pressure check and adjustment",
      "Valve replacement",
      "Tyre condition report",
    ],
  },
  {
    title: "Diagnostics",
    slug: "diagnostics",
    shortDescription: "Engine management light investigation and full electronic diagnostics using dealer-level equipment.",
    includes: [
      "OBD fault code reading",
      "Engine management light diagnosis",
      "Live data analysis",
      "System-specific diagnostics (ABS, airbag, etc.)",
      "Written report of findings",
    ],
  },
]

export function getAllServices(): Service[] {
  return SERVICES
}

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug)
}
