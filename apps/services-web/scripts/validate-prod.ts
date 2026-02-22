function req(name: string) {
  const v = process.env[name]
  if (!v || v.trim().length === 0) throw new Error(`Missing required env var: ${name}`)
  return v
}

function isPlaceholder(v: string) {
  const s = v.toLowerCase()
  return s.includes("tbd") || s.includes("placeholder") || s.includes("000000") || s.includes("123 ")
}

function checkNoPlaceholders(name: string) {
  const v = req(name)
  if (isPlaceholder(v)) throw new Error(`Env var looks like placeholder: ${name}="${v}"`)
}

function main() {
  // Critical fields for JSON-LD in production
  ;[
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_BUSINESS_NAME",
    "NEXT_PUBLIC_BUSINESS_PHONE",
    "NEXT_PUBLIC_BUSINESS_STREET",
    "NEXT_PUBLIC_BUSINESS_CITY",
    "NEXT_PUBLIC_BUSINESS_REGION",
    "NEXT_PUBLIC_BUSINESS_POSTCODE",
    "NEXT_PUBLIC_BUSINESS_COUNTRY",
    "NEXT_PUBLIC_BUSINESS_LAT",
    "NEXT_PUBLIC_BUSINESS_LNG",
  ].forEach(checkNoPlaceholders)

  // Reviews must be all-or-nothing (avoid fake partial config)
  const rating = process.env.NEXT_PUBLIC_REVIEW_RATING
  const count = process.env.NEXT_PUBLIC_REVIEW_COUNT
  if ((rating && !count) || (!rating && count)) {
    throw new Error("Review env vars must be set together: NEXT_PUBLIC_REVIEW_RATING + NEXT_PUBLIC_REVIEW_COUNT")
  }

  console.log("✅ Production env validation passed.")
}

main()
