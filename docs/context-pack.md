# Auto Nation — Context Pack (single source of truth)

Last updated: 2026-03-05
Owner: Marcus

## What this project is
A modern automotive system with:
- `apps/car-sale` (Next.js) — EXISTS and is live on Netlify (sales site)
- `apps/services-web` (Next.js) — EXISTS, core pages built, booking system in progress
- `apps/garage-admin` (Next.js) — planned internal dashboard
- Supabase (Postgres) — system of record for all operational data
- GoHighLevel (GHL) — CRM + automations + calendar availability
- Auto Trader partner feed — pending access (parser not implemented)

## Current priority (Decision)
We are building the **services site first** because Auto Trader feed access is pending and the client needs services ASAP.

Decision doc:
- `docs/decisions/decision — services site-first(2026-02-19).md`

## Repo snapshot (high-level)
Root:
- `ARCHITECTURE.md` (locked rules — system boundaries, tech constraints)
- `docs/` (gsd templates, decisions, deployment notes, TODO)
- `docs/TODO.md` (active task list — must be updated as work completes)
Apps:
- `apps/car-sale/` (Next.js sales site — live on Netlify)
- `apps/services-web/` (Next.js services site — booking system in progress)
- `apps/garage-admin/` (planned — internal dashboard for garage staff)

## Non-negotiables (from ARCHITECTURE.md)
- Everyday cars/vans tone: trustworthy, practical, friendly (no "elite/exclusive/performance" language)
- No invented trust claims, fake stats, fake reviews
- Both sites must share the same design tokens (dark UI + gold accent #D4AF37)
- `apps/car-sale` must NOT be recreated or redesigned drastically
- Supabase is the system of record — all operational data lives there
- No Strapi — do not introduce Strapi or any CMS not defined in ARCHITECTURE.md
- DVSA failures must never block bookings
- Service payments handled by GDS Workshop — platform does not process them
- Garage staff interact only with the Admin Dashboard — never GHL directly

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

Phase 3 (services-web build) — Largely built, booking system in progress
- Core Next.js app exists at `apps/services-web/`
- Pages built: `/` (homepage), `/services` (list), `/book` (booking form), `/contact` (contact form)
- API routes built: `/api/contact`, `/api/book` (Resend + Supabase + outbox)
- Supabase schema: Lead, Appointment, MotReport, GhlLink, OutboxEvent, ServiceConfig
- Outbox-based GHL sync: contact upsert, opportunity creation, MOT notes
- DVSA MOT enrichment (best-effort, never blocks)
- DVLA vehicle lookup on booking form
- **Confirmed-slot booking (IN PROGRESS — see `docs/TODO.md`):**
  - Patch diff reviewed, code changes not yet applied
  - Adds: ServiceConfig table, Appointment table, GET /api/availability, slot selection UI
  - Requires: 6 GHL calendars created, Services pipeline in GHL, env vars set
- **What's missing / incomplete:**
  - `/services/[slug]` detail pages — not built
  - No `sitemap.ts` or `robots.ts`
  - Contact details are placeholder (phone, address, email in components)
  - Hero "4.9/5 Google Rating" is hardcoded (should use env or be verified real)

Phase 4 (shared UI extraction) — Not started
- Later: extract shared Nav/Footer/Container/Section into `packages/ui`

Phase 5 (car-sale integration) — Not started
- Later: replace hardcoded cars with Supabase vehicles; add /sold archive, slug migration

Phase 6 (garage-admin dashboard) — Not started
- Later: internal dashboard for garage staff (bookings, schedule, pipeline, comms)

## services-web (apps/services-web) detailed status

### What's built
- **Homepage** (`app/page.tsx`) — Hero with image, trust items, stats row, 4 service card highlights, CTAs
- **Services list** (`app/services/page.tsx`) — all 6 services listed with book buttons
- **Booking page** (`app/book/page.tsx`) — form with vehicle lookup + service preselection via `?service=slug`
- **Contact page** (`app/contact/page.tsx`) — form + phone/email/address sidebar
- **API routes** — `/api/contact` and `/api/book` (Resend email + Supabase write + outbox)
- **Vehicle lookup** (`components/VehicleLookup.tsx`) — DVLA VES integration
- **Supabase schema** (Prisma) — Lead, MotReport, GhlLink, OutboxEvent, Client
- **Lib layer** — `db.ts`, `dvsa.ts`, `dvla.ts`, `ghl.ts`, `intake.ts`, `outbox.ts`
- **Navigation** (`components/Navigation.tsx`) — sticky, mobile slide-out menu
- **Footer** (`components/Footer.tsx`) — 3-column layout
- **MobileStickyCta** (`components/MobileStickyCta.tsx`) — fixed bottom CTA on mobile
- **shadcn primitives** — `button`, `card`, `input`
- **JSON-LD** (`lib/jsonld.ts`) — AutoRepair schema, all fields from env vars, null in prod if missing
- **Env validation** (`scripts/validate-prod.js`) — blocks `build:prod` if placeholders detected
- **Netlify** (`netlify.toml`) — Next.js plugin, Node 18, security headers
- **Design tokens** (`app/globals.css`) — gold primary, dark backgrounds, matches car-sale

### In progress (confirmed-slot booking)
- Service catalog in Supabase (`ServiceConfig` model with durations + GHL calendar IDs)
- `GET /api/availability` — fetches free slots from GHL calendars
- Slot selection UI on booking page (service + vehicleType + date + time grid)
- `POST /api/book` — writes Lead + Appointment to Supabase, queues GHL sync via outbox
- Outbox `BookingCreated` handler: GHL contact + calendar appointment + opportunity + MOT note
- Full task list: **`docs/TODO.md`**

### Placeholder content (must replace before deploy)
- Dev fallback phone/address/email in Footer + Contact — guarded by `isProd`, won't render in prod
- All trust claims (years, warranty, money-back) now env-driven — omitted if vars not set

## car-sale (apps/car-sale) key notes
- Still uses hardcoded vehicle data (`data/cars.ts`) via `services/cars.service.ts`
- Detail route currently `/cars/[id]` (not migrated to slug yet)
- Resend email endpoints exist (`/api/contact`, `/api/schedule`)
- View tracking exists (real tracking, not synthetic), but listing cards don't call API per-card

## Environment variables (known)

car-sale currently uses:
- RESEND_API_KEY, EMAIL_FROM, EMAIL_TO, NEXT_PUBLIC_WHATSAPP_NUMBER

services-web uses (see `.env.local.example`):
- DATABASE_URL (Supabase Postgres)
- RESEND_API_KEY, EMAIL_FROM, EMAIL_TO
- NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_BUSINESS_NAME, NEXT_PUBLIC_BUSINESS_PHONE
- NEXT_PUBLIC_BUSINESS_STREET, NEXT_PUBLIC_BUSINESS_CITY, NEXT_PUBLIC_BUSINESS_REGION
- NEXT_PUBLIC_BUSINESS_POSTCODE, NEXT_PUBLIC_BUSINESS_COUNTRY
- NEXT_PUBLIC_BUSINESS_LAT, NEXT_PUBLIC_BUSINESS_LNG
- DVLAAPI_KEY (DVLA vehicle lookup)
- DVSA_CLIENT_ID, DVSA_CLIENT_SECRET, DVSA_TOKEN_URL, DVSA_SCOPE, DVSA_ENABLED
- GHL_PRIVATE_KEY, GHL_LOCATION_ID, GHL_PIPELINE_ID, GHL_STAGE_ID_NEW
- GHL_SERVICES_PIPELINE_ID, GHL_STAGE_ID_BOOKED (confirmed booking pipeline)
- GHL_CAL_FULL_SERVICE, GHL_CAL_INTERIM_SERVICE, GHL_CAL_MOT_TESTING (GHL calendar IDs)
- GHL_CAL_BRAKE_REPAIRS, GHL_CAL_TYRE_FITTING, GHL_CAL_DIAGNOSTICS
- GARAGE_ADMIN_API_KEY (outbox route auth)
- NEXT_PUBLIC_REVIEW_RATING, NEXT_PUBLIC_REVIEW_COUNT, NEXT_PUBLIC_REVIEW_BEST (optional)
- NEXT_PUBLIC_HOURS_MON_FRI, NEXT_PUBLIC_HOURS_SAT, NEXT_PUBLIC_HOURS_SUN (optional)

## What we must NOT do right now
- Do not introduce Strapi or any CMS not defined in ARCHITECTURE.md
- Do not build the Auto Trader parser until feed format/access exists
- Do not refactor car-sale heavily or recreate it
- Do not extract shared UI yet unless services-web needs it immediately
- Do not add fake trust claims unless values come from verified sources or env vars

## Next concrete work
See `docs/TODO.md` for the active task list. Current priority:
1) **Apply confirmed-slot booking patch** (code changes 1-10 in TODO)
2) **GHL calendar setup** (manual steps 11-14 in TODO — Marcus)
3) **Database migration + seed** (steps 15-17 in TODO)
4) **Test + deploy** (steps 18-26 in TODO)

## Deploy services-web to Netlify

### Build command
```
npm run build:prod
```
This runs `validate:prod` (checks env vars for placeholders) then `next build`. Use `npm run build` locally to skip validation.

### Required env vars
| Variable | Example | Notes |
|---|---|---|
| `RESEND_API_KEY` | `re_xxxx` | Email delivery |
| `EMAIL_FROM` | `noreply@yourdomain.com` | Verified Resend sender |
| `EMAIL_TO` | `inbox@yourdomain.com` | Where form submissions land |
| `NEXT_PUBLIC_SITE_URL` | `https://services.example.com` | Used in JSON-LD + sitemap |
| `NEXT_PUBLIC_BUSINESS_NAME` | `Car Nation Services` | |
| `NEXT_PUBLIC_BUSINESS_PHONE` | `+441234567890` | Real phone |
| `NEXT_PUBLIC_BUSINESS_STREET` | `10 High Street` | Real address |
| `NEXT_PUBLIC_BUSINESS_CITY` | `Fishponds, Bristol` | |
| `NEXT_PUBLIC_BUSINESS_REGION` | `Bristol` | |
| `NEXT_PUBLIC_BUSINESS_POSTCODE` | `BS16 3XX` | |
| `NEXT_PUBLIC_BUSINESS_COUNTRY` | `GB` | |
| `NEXT_PUBLIC_BUSINESS_LAT` | `51.4752` | |
| `NEXT_PUBLIC_BUSINESS_LNG` | `-2.5281` | |
| `NEXT_PUBLIC_YEARS_EXPERIENCE` | `20` | Trust claim — omit if unverified |
| `NEXT_PUBLIC_WARRANTY_MONTHS` | `3` | Trust claim — omit if unverified |
| `NEXT_PUBLIC_MONEYBACK_DAYS` | `30` | Trust claim — omit if unverified |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `services@example.com` | Shown on contact page |

**Optional:** `NEXT_PUBLIC_REVIEW_RATING`, `NEXT_PUBLIC_REVIEW_COUNT`, `NEXT_PUBLIC_REVIEW_BEST`, `NEXT_PUBLIC_HOURS_MON_FRI`, `NEXT_PUBLIC_HOURS_SAT`, `NEXT_PUBLIC_HOURS_SUN`

### Testing forms (Resend)
1. Set `RESEND_API_KEY` to a valid key from [resend.com](https://resend.com)
2. On the free tier, `EMAIL_FROM` must be `onboarding@resend.dev` and `EMAIL_TO` must be the account owner's email
3. Submit `/book` and `/contact` forms — check the Resend dashboard for delivery logs
4. Verify `replyTo` is set to the submitter's email (so you can reply directly)

## Phase alignment note
`ARCHITECTURE.md` has the original phase order (services-web = Phase 5). This context pack reflects the priority decision to build services-web as Phase 3. **This context pack owns phase order and status. ARCHITECTURE.md owns rules, tokens, and constraints.**

## Keeping this file up to date
This file and `docs/TODO.md` must be updated as work progresses:
- When a TODO item is completed, check it off in `docs/TODO.md`
- When a phase status changes, update the phase section above
- When new env vars are added, add them to the env vars section
- When new features are built, update the "services-web detailed status" section
- When architecture decisions change, update non-negotiables (but defer to `ARCHITECTURE.md`)

**Claude:** After completing any task, update `docs/TODO.md` (check off items) and this file (status sections) before finishing.

## How Claude should be used (context control)
When running tasks:
- Always read:
  - `ARCHITECTURE.md` (system boundaries and rules)
  - `docs/context-pack.md` (current state and status)
  - `docs/TODO.md` (active task list)
  - the relevant decision doc (if applicable)
- Do not re-audit the repo unless asked
- After completing work, update TODO.md and this file
