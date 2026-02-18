# Strapi Integration — TODO

## Stats & Social Proof (from Phase 1)
- `lib/siteSettings.ts` is the central hook point — replace local constants with Strapi API calls
- `siteSettings.yearsInBusiness` — used in Hero stats, TrustBadges, footer, contact page
- `siteSettings.customerRating` — used in Hero stats, SocialProof (hidden when null)
- `siteSettings.reviewSourceUrl` — used in SocialProof Trustpilot link (hidden when null)
- Vehicle view counts — car detail page now has real in-memory tracking (`/api/vehicle-view`); CarCard still `0`. Persist to Strapi/Redis later so counts survive deploys
- SpotlightVehicle "High interest" — removed, wire to real view data
- Inventory count in Hero — currently reads from local data array, wire to Strapi query
