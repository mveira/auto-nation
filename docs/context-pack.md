# Auto Nation — Context Pack (single source of truth)

Last updated: 2026-02-23
Owner: Marcus

## What this project is
A modern automotive system with:
- `apps/car-sale` (Next.js) — EXISTS and is live on Netlify (sales site)
- `apps/services-web` (Next.js) — EXISTS, core pages built, not yet deployed (see status below)
- `apps/cms` (Strapi on Railway + Postgres) — CMS + vehicle store + sync skeleton
- GoHighLevel (GHL) — CRM + automations (not wired yet)
- Auto Trader partner feed — pending access (parser not implemented)

## Current priority (Decision)
We are building the **services site first** because Auto Trader feed access is pending and the client needs services ASAP.

Decision doc:
- `docs/decisions/decision — services site-first(2026-02-19).md`

## Repo snapshot (high-level)
Root:
- `ARCHITECTURE.md` (locked rules — tokens, tone, tech constraints)
- `PSYCHOLOGY.md` (legacy notes; tone rules now in ARCHITECTURE)
- `docs/` (gsd templates, decisions, deployment notes)
Apps:
- `apps/car-sale/` (Next.js sales site — live on Netlify)
- `apps/services-web/` (Next.js services site — built, pre-deploy)
- `apps/cms/` (Strapi CMS — deployed on Railway)

## Non-negotiables (from ARCHITECTURE.md)
- Everyday cars/vans tone: trustworthy, practical, friendly (no "elite/exclusive/performance" language)
- No invented trust claims, fake stats, fake reviews
- Both sites must share the same design tokens (dark UI + gold accent #D4AF37)
- `apps/car-sale` must NOT be recreated or redesigned drastically
- Strapi is a separate deployed service (Railway), not inside Next.js
- Vehicles in Strapi are never deleted; sold archive rules exist (SOLD_VISIBLE_DAYS)

## Where we are by phase

Phase 0 — Done
- Current state map, integration requirements, UI audit docs created

Phase 1 (car-sale trust + tokens cleanup) — In progress / partial
- Real view tracking API exists (detail page wired)
- Synthetic "views" removed from car cards (hidden until real data)
- Token unification still pending (gold must be centralized and consistent)

Phase 2 (feed sync logic) — Skeleton done, blocked on Auto Trader feed access
- Cron wiring + env helper + sync service skeleton created in Strapi
- `parseFeed()` intentionally returns [] until feed format is known
- Safety: zero parsed vehicles => no sold detection

Phase 3 (services-web build) — Largely built, needs finishing (see details below)
- Core Next.js app exists at `apps/services-web/`
- Pages built: `/` (homepage), `/services` (list), `/book` (booking form), `/contact` (contact form)
- API routes built: `/api/contact`, `/api/book` (both using Resend)
- Design tokens aligned with car-sale (gold + dark UI via CSS vars)
- JSON-LD AutoRepair structured data (env-driven, prod-safe)
- Netlify config + pre-build env validation in place
- **What's missing / incomplete:**
  - `/services/[slug]` detail pages — not built
  - Services data is hardcoded (`services/services.service.ts`), not connected to Strapi
  - No `sitemap.ts` or `robots.ts`
  - Contact details are placeholder (phone, address, email in components)
  - Hero "4.9/5 Google Rating" is hardcoded in component (should use env or be verified real)

Phase 4 (shared UI extraction) — Not started
- Later: extract shared Nav/Footer/Container/Section into `packages/ui`

Phase 5 (car-sale Strapi integration) — Not started
- Later: replace hardcoded cars with Strapi vehicles; add /sold archive, slug migration

Phase 6 (GHL wiring) — Not started
- Later: replace/augment Resend-only lead handling with GHL pipelines

## services-web (apps/services-web) detailed status

### What's built
- **Homepage** (`app/page.tsx`) — Hero with image, trust items, stats row, 4 service card highlights, CTAs
- **Services list** (`app/services/page.tsx`) — all 6 services listed with book buttons
- **Booking page** (`app/book/page.tsx`) — full form with service preselection via `?service=slug`
- **Contact page** (`app/contact/page.tsx`) — form + phone/email/address sidebar
- **API routes** — `/api/contact` and `/api/book` send emails via Resend
- **Navigation** (`components/Navigation.tsx`) — sticky, mobile slide-out menu
- **Footer** (`components/Footer.tsx`) — 3-column layout
- **MobileStickyCta** (`components/MobileStickyCta.tsx`) — fixed bottom CTA on mobile
- **shadcn primitives** — `button`, `card`, `input`
- **JSON-LD** (`lib/jsonld.ts`) — AutoRepair schema, all fields from env vars, null in prod if missing
- **Env validation** (`scripts/validate-prod.ts`) — blocks build if placeholders detected
- **Netlify** (`netlify.toml`) — Next.js plugin, Node 18, security headers
- **Design tokens** (`app/globals.css`) — gold primary, dark backgrounds, matches car-sale

### What's NOT built
- `/services/[slug]` — individual service detail pages (ARCHITECTURE.md requires this)
- Strapi integration — services are hardcoded in `services/services.service.ts`, not fetched from CMS
- `sitemap.ts` — no sitemap generation
- `robots.ts` — no robots.txt generation

### Placeholder content (must replace before deploy)
- Phone: `07700 900123` (in contact page, footer, hero)
- Address: `123 Fishponds Road, Fishponds, Bristol, BS16 3AN` (contact page, footer)
- Email: `services@carnation.co.uk` (contact page)
- Hero `4.9/5 Google Rating` — hardcoded in `components/Hero.tsx:131-134`, not env-driven

### Completeness: ~72%
Functional UI and forms are done. Missing service detail pages, Strapi integration, SEO files, and real business details.

## Strapi (apps/cms) status
Strapi exists with content types:
- Vehicle (collection)
- Service (collection)
- Site Settings (single)

Sync skeleton:
- `apps/cms/src/api/vehicle/services/auto-trader-sync.ts`
- `apps/cms/config/cron-tasks.ts`
- `apps/cms/src/lib/env.ts`

Production setup docs:
- Root: `docs/deployment/strapi-production-setup.md`
- Inside cms: `apps/cms/docs/deployment/strapi-production-setup.md`

Security intent:
- Public role should be read-only (find/findOne) for required collections
- Write operations only via Admin / API tokens

## car-sale (apps/car-sale) key notes
- Still uses hardcoded vehicle data (`data/cars.ts`) via `services/cars.service.ts`
- Detail route currently `/cars/[id]` (not migrated to slug yet)
- Resend email endpoints exist (`/api/contact`, `/api/schedule`)
- View tracking exists (real tracking, not synthetic), but listing cards don't call API per-card

## Environment variables (known)

car-sale currently uses:
- RESEND_API_KEY, EMAIL_FROM, EMAIL_TO, NEXT_PUBLIC_WHATSAPP_NUMBER

services-web uses (see `.env.local.example`):
- RESEND_API_KEY, EMAIL_FROM, EMAIL_TO
- NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_BUSINESS_NAME, NEXT_PUBLIC_BUSINESS_PHONE
- NEXT_PUBLIC_BUSINESS_STREET, NEXT_PUBLIC_BUSINESS_CITY, NEXT_PUBLIC_BUSINESS_REGION
- NEXT_PUBLIC_BUSINESS_POSTCODE, NEXT_PUBLIC_BUSINESS_COUNTRY
- NEXT_PUBLIC_BUSINESS_LAT, NEXT_PUBLIC_BUSINESS_LNG
- NEXT_PUBLIC_REVIEW_RATING, NEXT_PUBLIC_REVIEW_COUNT, NEXT_PUBLIC_REVIEW_BEST (optional)
- NEXT_PUBLIC_HOURS_MON_FRI, NEXT_PUBLIC_HOURS_SAT, NEXT_PUBLIC_HOURS_SUN (optional)

Strapi sync uses:
- AUTO_TRADER_SYNC_ENABLED (true/false)
- AUTO_TRADER_FEED_URL (pending)
- AUTO_TRADER_SYNC_CRON (default */10 * * * *)
- SOLD_VISIBLE_DAYS (default 30)
- CORS_ORIGINS (comma-separated)

## What we must NOT do right now
- Do not build the Auto Trader parser until feed format/access exists
- Do not refactor car-sale heavily or recreate it
- Do not extract shared UI yet unless services-web needs it immediately
- Do not add fake "X people viewing" or invented "happy customers" unless values come from Site Settings in Strapi

## Next concrete work (finish services-web for deploy)
1) Build `/services/[slug]` detail pages — individual service pages with full description, pricing guidance, and a book CTA
2) Connect services data to Strapi — replace hardcoded `services/services.service.ts` with Strapi API calls (Service collection type already exists in CMS)
3) Add `app/sitemap.ts` — generate sitemap from service slugs
4) Add `app/robots.ts` — standard robots.txt allowing crawling
5) Replace placeholder contact details — get real phone, address, email from client and update `contact/page.tsx`, `Footer.tsx`, `Hero.tsx`, and `.env.local.example`
6) Fix Hero Google Rating — either make it env-driven (like JSON-LD already is) or remove until verified real
7) Populate Strapi Service entries — add the 6 services (currently hardcoded) as CMS content
8) Deploy to Netlify — create second Netlify site, configure env vars using `validate-prod.ts` safety net
9) Test forms end-to-end — verify `/api/contact` and `/api/book` deliver emails with real Resend config
10) Wire cross-site navigation — add link to car-sale from services nav and vice versa (simple href, not shared component yet)

## Phase alignment note
`ARCHITECTURE.md` has the original phase order (services-web = Phase 5). This context pack reflects the priority decision to build services-web as Phase 3. **This context pack owns phase order and status. ARCHITECTURE.md owns rules, tokens, and constraints.**

## How Claude should be used (context control)
When running tasks:
- Always read ONLY:
  - `docs/context-pack.md`
  - the relevant decision doc
  - the specific work-order doc for the task
- Do not re-audit the repo unless asked.
