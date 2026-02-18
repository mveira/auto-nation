check this first - # Auto Nation — Architecture Rules (Shipping Mode)

## Role
You are a senior full-stack engineer + UI/UX designer shipping a production-ready automotive system fast.

## Goal
Build a modern automotive system with:
- A car sales website (Next.js)
- A services website (Next.js)
- Shared CMS (Strapi on Railway)
- Shared CRM + automations (GoHighLevel)
- Auto Trader partner feed powering vehicle inventory
- Sold vehicles remain on-site (archive) for SEO/social proof

## Apps & Systems
- Strapi must run as a separate deployed service (not inside the Next.js apps)
- `apps/car-sale` — Next.js App Router (vehicle sales) **EXISTS ALREADY**
- `apps/services-web` — Next.js App Router (services)
- `apps/cms` — Strapi (content + vehicle store) hosted on Railway + Postgres
- GHL — external CRM (two pipelines: Sales + Services)
- Netlify — hosts both Next.js sites (two Netlify sites)

---

## Positioning & Tone (Locked)
This business sells everyday cars and vans.
Tone must be:
- trustworthy, practical, and friendly
- professional, clear pricing, straightforward CTAs
- clean modern UI (premium build quality), but NOT “exclusive/elite/performance” language
Visual quality is premium (gold accent, clean dark UI),
but messaging must remain practical and trustworthy.
Avoid “exclusive”, “elite”, or performance-only language.


## Truth & Trust Rules (Non-negotiable)
- Do not invent trust claims, compliance badges, fake stats, or fake reviews
- Only display real, verified trust items provided by the business

---

## Theme & UI Consistency (Locked)
- The services site MUST match the car-sale design theme.
- Navigation and Footer must be shared components (single source of truth).
- Extract shared shell into `packages/ui`:
  - `Navigation`, `Footer`, `Container`, `Section`
- Avoid premature abstraction beyond the shared shell.

---

## Design System Tokens (Locked)

Both `car-sale` and `services-web` MUST use identical design tokens.
Tokens must be defined centrally (Tailwind config or shared theme file). Avoid hard-coded one-off styles.

### Color Palette (Everyday Cars/Vans)
Primary Background:
- `--bg-primary: #111111`

Secondary Background:
- `--bg-secondary: #1A1A1A`

Primary Text:
- `--text-primary: #FAFAFA`

Muted Text:
- `--text-muted: #A1A1AA`

Primary Accent (Brand Highlight)
- `--accent-primary: #D4AF37` (Gold)

Accent Hover:
- Slightly darker gold (90% brightness)

Borders:
- `--border-default: #2A2A2A`

Gold is used only for:
- Primary CTAs
- Important badges (e.g. SOLD, Featured)
- Accent lines or highlights
- Key pricing emphasis

Gold must NOT be overused.

### Typography
Font:
- Inter (300, 400, 600, 700, 900)

Headings:
- tight tracking
- weights 600–900
- strong size contrast for hierarchy

Body:
- 300–400
- comfortable line-height

### Radius & Spacing
Border Radius:
- Cards: `rounded-2xl`
- Buttons: `rounded-xl`
- Inputs: `rounded-xl`

Spacing System:
- Tailwind spacing scale (4px system)
- Section padding: `py-16` mobile, `py-24` desktop where appropriate

Shadows:
- subtle dark shadows only
- no colorful glow

### Motion Rules
- Framer Motion only when necessary
- no excessive animation
- transitions must feel subtle and professional

---

## Tech Rules (Locked)
### Environment & Secrets
- All credentials (Strapi tokens, GHL keys, email keys) must be stored in environment variables.
- No secrets committed to the repository.
- Each deployment target (Netlify, Railway) maintains its own env configuration.

- Next.js App Router only (no Pages Router)
- TypeScript required
- Tailwind for styling
- shadcn/ui allowed and preferred for primitives
- Server Components by default; Client Components only when necessary
- Netlify compatible (no Vercel-only assumptions)

---

## Data & Integration Rules (Locked)

### Vehicles (Auto Trader → Strapi)
Vehicle images may initially be stored as external feed URLs.
Media ingestion into Strapi is optional and may be introduced later if required.
- Source: official Auto Trader partner feed/export
- Sync frequency: every 10–15 minutes (default)
- Vehicles stored in Strapi with:
  - `status`: `live` | `sold`
  - `externalId` (unique)
  - `slug` (stable URL key)

URL rules:
- Vehicle detail route is `/cars/[slug]`
- Slugs must be stable over time
- Sold vehicle detail pages must remain accessible forever (no 404)

Sold rules:
- Never delete vehicles from Strapi.
- If feed includes sold/status flag: mark sold on same sync run.
- If no sold flag exists: missing vehicles are marked sold on next sync.

### Sold visibility window + archive
- Config: `SOLD_VISIBLE_DAYS` (default 30)
- Sold vehicles remain in the main inventory list for `SOLD_VISIBLE_DAYS`.
- After that, they move to a permanent Sold Archive page (`/sold`).
- Vehicle detail pages remain accessible forever.

### Featured Vehicles (CMS capability)
- CMS must support selecting featured vehicles for homepage/spotlight.
- Featured applies only to `status=live`.
- Manual ordering required.
- Fallback: newest live vehicles if none featured.

### Content (Strapi)
Public API access must be read-only and limited to required collections/fields.
All write operations (sync, admin updates) require secure API token authentication.
- Strapi stores:
  - services content
  - pages (about, finance, warranty, FAQs)
  - testimonials/reviews content (if used and real)
- Strapi does NOT replace CRM.

### CRM (GHL)
- One GHL sub-account for this business.
- Two pipelines:
  1) Vehicle Sales
  2) Services
- Enquiries from BOTH sites flow into GHL with:
  - `lead_source`
  - UTM parameters
- Automations must be helpful and not spammy.

---

## UX Rules (Locked)
- One primary CTA per section
- Filters must be usable on mobile
- Sticky enquiry CTA on car detail (mobile)

Sold vehicle UX:
- clearly show SOLD label/badge
- replace primary CTA with practical options:
  - “Enquire about similar vehicles”
  - “Get notified when a similar one arrives”
  - “Call / WhatsApp us”
- keep full specs + images + description for SEO

---

## Strapi Modeling Ownership
Strapi schema design (fields, content types, permissions) is handled by the Strapi agent.
This document defines REQUIRED capabilities only.

---

## Protect Existing car-sale Site (Critical)
The `apps/car-sale` site already exists and is the baseline.

DO NOT:
- recreate car-sale from scratch
- replace its folder structure
- change its design direction drastically
- remove existing pages/components unless explicitly requested

ONLY:
- refactor minimally when required for integration (Strapi feed, shared nav/footer)
- preserve existing UX patterns and routes
- make incremental changes with clear file diffs

If any proposed change impacts existing behavior, list the impact first.

---

## Before Coding (Critical Inputs)
If any of these are missing, ASK FIRST:
- Brand name + logo assets
- WhatsApp yes/no and destination number
- Finance yes/no and finance provider details (if any)
- Contact destination (email + phone)
- Trust items allowed (only real, verified)
- Confirm Auto Trader feed access method + sample record availability

## Deployment Order (Locked)

Phase 0: Current State Map + Integration Plan + UI Consistency Audit (no code changes)
Phase 1: Strapi setup (apps/cms)
Phase 2: Feed sync logic
Phase 3: Integrate car-sale with Strapi
Phase 4: Extract shared UI
Phase 5: Build services site
Phase 6: GHL automation wiring