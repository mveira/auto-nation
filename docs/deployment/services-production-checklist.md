# Services Site – Production Checklist

## Structured Data (JSON-LD) – REQUIRED BEFORE GO-LIVE

The AutoRepair schema in:

apps/services-web/app/layout.tsx

currently contains placeholder values for:

- Business name (if temporary)
- Address
- Telephone number
- Coordinates
- Aggregate rating (ratingValue, ratingCount)
- Opening hours

These MUST be replaced with verified, real business data before deployment.

Shipping with incorrect structured data can:
- Damage local SEO credibility
- Trigger Google Rich Result penalties
- Create legal exposure if fake reviews are implied

Before go-live:
- [ ] Confirm correct business name
- [ ] Confirm full postal address
- [ ] Confirm correct phone number
- [ ] Confirm accurate opening hours
- [ ] Remove aggregateRating if real reviews do not yet exist
- [ ] Validate structured data using: https://search.google.com/test/rich-results
