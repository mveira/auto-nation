type OpeningHoursSpec = {
  "@type": "OpeningHoursSpecification"
  dayOfWeek: string | string[]
  opens: string
  closes: string
}

function parseHours(dayLabel: string | string[], value?: string): OpeningHoursSpec | null {
  if (!value) return null
  const [opens, closes] = value.split("-").map((s) => s.trim())
  if (!opens || !closes) return null
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: dayLabel,
    opens,
    closes,
  }
}

export function buildAutoRepairJsonLd() {
  const isProd = process.env.NODE_ENV === "production"

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const name = process.env.NEXT_PUBLIC_BUSINESS_NAME
  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE
  const street = process.env.NEXT_PUBLIC_BUSINESS_STREET
  const city = process.env.NEXT_PUBLIC_BUSINESS_CITY
  const region = process.env.NEXT_PUBLIC_BUSINESS_REGION
  const postcode = process.env.NEXT_PUBLIC_BUSINESS_POSTCODE
  const country = process.env.NEXT_PUBLIC_BUSINESS_COUNTRY
  const lat = process.env.NEXT_PUBLIC_BUSINESS_LAT
  const lng = process.env.NEXT_PUBLIC_BUSINESS_LNG

  if (isProd) {
    const missing = [siteUrl, name, phone, street, city, region, postcode, country, lat, lng].some(
      (v) => !v || String(v).trim().length === 0
    )
    if (missing) return null
  }

  const openingHoursSpecification: OpeningHoursSpec[] = [
    parseHours(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], process.env.NEXT_PUBLIC_HOURS_MON_FRI),
    parseHours("Saturday", process.env.NEXT_PUBLIC_HOURS_SAT),
    parseHours("Sunday", process.env.NEXT_PUBLIC_HOURS_SUN),
  ].filter(Boolean) as OpeningHoursSpec[]

  const ratingValue = process.env.NEXT_PUBLIC_REVIEW_RATING
  const ratingCount = process.env.NEXT_PUBLIC_REVIEW_COUNT
  const bestRating = process.env.NEXT_PUBLIC_REVIEW_BEST || "5"

  const aggregateRating =
    ratingValue && ratingCount
      ? {
        "@type": "AggregateRating" as const,
        ratingValue: String(ratingValue),
        bestRating: String(bestRating),
        ratingCount: String(ratingCount),
      }
      : undefined

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: name ?? "Car Nation Services",
    description:
      "Independent car servicing, repairs, and MOT testing in Fishponds, Bristol. Clear pricing and a repair warranty.",
    url: siteUrl ?? "http://localhost:3000",
    telephone: phone ?? "+440000000000",
    priceRange: "££",
    image: `${siteUrl ?? "http://localhost:3000"}/images/service-hero.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: street ?? "TBD",
      addressLocality: city ?? "TBD",
      addressRegion: region ?? "TBD",
      postalCode: postcode ?? "TBD",
      addressCountry: country ?? "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: lat ? Number(lat) : 0,
      longitude: lng ? Number(lng) : 0,
    },
    openingHoursSpecification,
    areaServed: { "@type": "City", name: "Bristol" },
  }

  if (aggregateRating) jsonLd.aggregateRating = aggregateRating

  return jsonLd
}
