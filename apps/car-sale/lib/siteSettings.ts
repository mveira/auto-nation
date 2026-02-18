/**
 * Site-wide settings — single source of truth for business data shown across the UI.
 *
 * Currently: hardcoded local constants.
 * Future: replace with Strapi API call (single-type "Site Settings" content type).
 *
 * Consumers: Hero stats, TrustBadges, SocialProof, Footer, Contact page.
 * Nullable fields (customerRating, reviewSourceUrl) hide their UI when null.
 *
 * See docs/strapi-todo.md for the full integration plan.
 */

export const siteSettings = {
  // Business info — update with real values
  businessName: "Car Nation",
  yearsInBusiness: "25+",
  tagline: "Quality used cars and vans for every journey",

  // Trust badges — only show verified, real items
  trustBadges: {
    hpiClearEnabled: true,
    clearPricingEnabled: true,
    partExchangeEnabled: true,
    warrantyIncludedEnabled: true,
  },

  // Contact
  phone: "07700 900123",
  phoneFull: "+447700900123",
  address: {
    line1: "123 Fishponds Road",
    line2: "Fishponds, Bristol",
    postcode: "BS16 3AN",
  },

  // Social proof — only use when real reviews are wired
  // TODO: Wire from Strapi or Trustpilot API later
  customerRating: null as string | null, // e.g. "4.9" — set to null until verified
  reviewCount: null as number | null,
  reviewSourceUrl: null as string | null, // e.g. Trustpilot URL
} as const
