# Strapi Schema Notes

## Vehicle (collection type)

| Field | Type | Notes |
|---|---|---|
| `externalId` | string, unique, required | Auto Trader vehicle ID. Used for dedup during sync. |
| `title` | string, required | Display title, e.g. "2021 Ford Focus 1.0T EcoBoost". |
| `slug` | uid (from title), required | Stable URL key for `/cars/[slug]`. UID type auto-generates from title. Must never change once set (ARCHITECTURE.md: slugs must be stable). |
| `status` | enum [live, sold], required | Vehicles are never deleted — only marked `sold`. |
| `soldAt` | datetime, nullable | Set when status changes to `sold`. Used with `soldVisibleDays` to determine archive cutoff. |
| `firstSeenAt` | datetime, required | When the vehicle first appeared in the feed. |
| `lastSeenAt` | datetime, required | Updated on every sync run. Used to detect missing vehicles. |
| `featured` | boolean, default false | Enables homepage/spotlight placement. Only meaningful when `status=live`. |
| `featuredOrder` | integer, nullable | Manual sort order for featured vehicles. Lower = first. |
| `make` | string, required | e.g. "Ford" |
| `model` | string, required | e.g. "Focus" |
| `year` | integer, required | Model year |
| `price` | decimal, required | Listed price |
| `mileage` | integer | Odometer reading |
| `fuelType` | string | e.g. "Petrol", "Diesel", "Electric" |
| `transmission` | string | e.g. "Manual", "Automatic" |
| `bodyType` | string | e.g. "Hatchback", "SUV", "Van" |
| `colour` | string | Exterior colour |
| `doors` | integer | Number of doors |
| `engineSize` | string | e.g. "1.0L", "2.0L" |
| `description` | richtext | Full vehicle description |
| `images` | json | Array of image URL strings. External feed URLs for now — media ingestion into Strapi is deferred per ARCHITECTURE.md. |

Draft/publish is **disabled** for Vehicle — the sync worker manages lifecycle via `status` field.

## Site Settings (single type)

| Field | Type | Notes |
|---|---|---|
| `happyCustomersCount` | integer, nullable | Displayed in Hero stats and trust sections. Nullable so it's hidden when not set. |
| `yearsInBusiness` | integer, nullable | Used in Hero, TrustBadges, footer, contact page. |
| `showTrustBadges` | boolean, default true | Toggle trust badges section visibility. |
| `showSocialProof` | boolean, default true | Toggle social proof section visibility. |
| `soldVisibleDays` | integer, default 30 | How many days a sold vehicle remains in the main inventory list before moving to `/sold` archive. |

## Service (collection type)

| Field | Type | Notes |
|---|---|---|
| `title` | string, required | Service name, e.g. "MOT Testing". |
| `slug` | uid (from title), required | URL key for service detail pages on services-web. |
| `description` | richtext | Service details. |
| `icon` | string | Icon identifier (e.g. icon name from an icon set). |
| `order` | integer | Display sort order. |

Draft/publish is **enabled** for Service — allows preparing content before publishing.
