# Auto Nation — Context Pack (single source of truth)

Last updated: 2026-02-19  
Owner: Marcus

## What this project is
A modern automotive system with:
- `apps/car-sale` (Next.js) — EXISTS and is live on Netlify (sales site)
- `apps/services-web` (Next.js) — NOT built yet (priority next)
- `apps/cms` (Strapi on Railway + Postgres) — CMS + vehicle store + sync skeleton
- GoHighLevel (GHL) — CRM + automations (not wired yet)
- Auto Trader partner feed — pending access (parser not implemented)

## Current priority (Decision)
We are building the **services site first** because Auto Trader feed access is pending and the client needs services ASAP.

Decision doc:
- `docs/decisions/decision — services site-first(2026-02-19).md`

## Repo snapshot (high-level)
Root:
- `ARCHITECTURE.md` (locked rules)
- `PSYCHOLOGY.md` (legacy notes; tone rules now in ARCHITECTURE)
- `docs/` (gsd templates, decisions, deployment notes)
Apps:
- `apps/car-sale/` (Next.js sales site)
- `apps/cms/` (Strapi CMS)

## Non-negotiables (from ARCHITECTURE.md)
- Everyday cars/vans tone: trustworthy, practical, friendly (no “elite/exclusive/performance” language)
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
- Synthetic “views” removed from car cards (hidden until real data)
- Token unification still pending (gold must be centralized and consistent)

Phase 2 (feed sync logic) — Skeleton done, blocked on Auto Trader feed access
- Cron wiring + env helper + sync service skeleton created in Strapi
- `parseFeed()` intentionally returns [] until feed format is known
- Safety: zero parsed vehicles => no sold detection

Phase 3 (services-web build) — NOT started (NOW the priority)
- Build `apps/services-web` using same design tokens as car-sale
- Use Strapi for services content (Service collection type exists)

Phase 4 (shared UI extraction) — Not started
- Later: extract shared Nav/Footer/Container/Section into `packages/ui`

Phase 5 (car-sale Strapi integration) — Not started
- Later: replace hardcoded cars with Strapi vehicles; add /sold archive, slug migration

Phase 6 (GHL wiring) — Not started
- Later: replace/augment Resend-only lead handling with GHL pipelines

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
- View tracking exists (real tracking, not synthetic), but listing cards don’t call API per-card

## Environment variables (known)
car-sale currently uses:
- RESEND_API_KEY, EMAIL_FROM, EMAIL_TO, NEXT_PUBLIC_WHATSAPP_NUMBER

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
- Do not add fake “X people viewing” or invented “happy customers” unless values come from Site Settings in Strapi

## Next concrete work (services site first)
1) Create `apps/services-web` (Next.js + TS + Tailwind + shadcn/ui)
2) Match design tokens to car-sale (same palette, radius, typography)
3) Build services pages using Strapi Service content type:
   - services list
   - service detail (/services/[slug])
   - contact/booking CTA (no GHL wiring yet unless requested)
4) Add Netlify deployment notes for second site

## How Claude should be used (context control)
When running tasks:
- Always read ONLY:
  - `docs/context-pack.md`
  - the relevant decision doc
  - the specific work-order doc for the task
- Do not re-audit the repo unless asked.
