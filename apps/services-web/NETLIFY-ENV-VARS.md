# Netlify environment variables

Set these in **Netlify → Site configuration → Environment variables** (or **Build & deploy → Environment → Environment variables**). Use **Production** (and optionally **Branch deploys** / **Deploy previews**) as needed.

**Important:** After changing env vars, trigger a **new deploy** so the build picks them up. `NEXT_PUBLIC_*` values are baked in at build time.

---

## Required for production build (validate-prod)

If you use `npm run build:prod`, these must be set and must not look like placeholders (e.g. no "TBD", "123 Fishponds Road" as placeholder):

| Variable | Example | Notes |
|----------|---------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://yoursite.netlify.app` | No trailing slash. Used in sitemap, robots, JSON-LD. |
| `NEXT_PUBLIC_BUSINESS_NAME` | `Car Nation Services` | |
| `NEXT_PUBLIC_BUSINESS_PHONE` | `+441171234567` | E.164 preferred. |
| `NEXT_PUBLIC_BUSINESS_STREET` | `123 Fishponds Road` | |
| `NEXT_PUBLIC_BUSINESS_CITY` | `Fishponds, Bristol` | |
| `NEXT_PUBLIC_BUSINESS_REGION` | `Bristol` | |
| `NEXT_PUBLIC_BUSINESS_POSTCODE` | `BS16 3AN` | |
| `NEXT_PUBLIC_BUSINESS_COUNTRY` | `GB` | |
| `NEXT_PUBLIC_BUSINESS_LAT` | `51.4752` | For map/JSON-LD. |
| `NEXT_PUBLIC_BUSINESS_LNG` | `-2.5281` | For map/JSON-LD. |

---

## Email (Resend)

| Variable | Example | Notes |
|----------|---------|--------|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` | From Resend dashboard. Required for contact/book emails. |
| `EMAIL_FROM` | `onboarding@resend.dev` | Sender address (must be verified in Resend). |
| `EMAIL_TO` | `your-email@example.com` | Where form submissions are sent. |

---

## Public site / contact (NEXT_PUBLIC_*)

| Variable | Example | Notes |
|----------|---------|--------|
| `NEXT_PUBLIC_CONTACT_EMAIL` | `services@carnation.co.uk` | Shown on contact page. |
| `NEXT_PUBLIC_YEARS_EXPERIENCE` | `20` | Trust claim on homepage. |
| `NEXT_PUBLIC_WARRANTY_MONTHS` | `3` | Trust claim. |
| `NEXT_PUBLIC_MONEYBACK_DAYS` | `30` | Trust claim. |
| `NEXT_PUBLIC_HOURS_MON_FRI` | `08:00-18:00` | Optional; for JSON-LD. |
| `NEXT_PUBLIC_HOURS_SAT` | `08:00-18:00` | Optional. |
| `NEXT_PUBLIC_HOURS_SUN` | `09:00-18:00` | Optional. |

---

## Reviews (optional)

Set **both** or neither (validate-prod enforces this):

| Variable | Example | Notes |
|----------|---------|--------|
| `NEXT_PUBLIC_REVIEW_RATING` | `4.9` | e.g. Trustpilot average. |
| `NEXT_PUBLIC_REVIEW_COUNT` | `200` | |
| `NEXT_PUBLIC_REVIEW_BEST` | `5` | Optional; defaults to `5`. |

---

## GoHighLevel webhooks (optional)

Leave unset to disable sending form data to GHL.

| Variable | Example | Notes |
|----------|---------|--------|
| `GHL_WEBHOOK_BOOK_URL` | `https://services.leadconnectorhq.com/hooks/...` | Booking form. |
| `GHL_WEBHOOK_CONTACT_URL` | `https://services.leadconnectorhq.com/hooks/...` | Contact form. |

---

## DVLA vehicle lookup (optional)

Only needed if you use the vehicle lookup API (e.g. MOT/registration checks).

| Variable | Example | Notes |
|----------|---------|--------|
| `DVLAAPI_KEY` | *(from DVLA VES)* | Server-side only. Name is `DVLAAPI_KEY` (no underscore between DVLA and API). |

---

## Do not set (or set to false)

| Variable | Value | Notes |
|----------|--------|--------|
| `NETLIFY_NEXT_PLUGIN_SKIP` | Do not set, or `false` | If `true`, Next.js runtime is disabled and the site will 404. |

---

## Quick copy list (names only)

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_BUSINESS_NAME
NEXT_PUBLIC_BUSINESS_PHONE
NEXT_PUBLIC_BUSINESS_STREET
NEXT_PUBLIC_BUSINESS_CITY
NEXT_PUBLIC_BUSINESS_REGION
NEXT_PUBLIC_BUSINESS_POSTCODE
NEXT_PUBLIC_BUSINESS_COUNTRY
NEXT_PUBLIC_BUSINESS_LAT
NEXT_PUBLIC_BUSINESS_LNG
NEXT_PUBLIC_CONTACT_EMAIL
NEXT_PUBLIC_YEARS_EXPERIENCE
NEXT_PUBLIC_WARRANTY_MONTHS
NEXT_PUBLIC_MONEYBACK_DAYS
NEXT_PUBLIC_HOURS_MON_FRI
NEXT_PUBLIC_HOURS_SAT
NEXT_PUBLIC_HOURS_SUN
NEXT_PUBLIC_REVIEW_RATING
NEXT_PUBLIC_REVIEW_COUNT
NEXT_PUBLIC_REVIEW_BEST
RESEND_API_KEY
EMAIL_FROM
EMAIL_TO
GHL_WEBHOOK_BOOK_URL
GHL_WEBHOOK_CONTACT_URL
DVLAAPI_KEY
```

Use your real values from `.env.local` (or your notes); never commit secrets to the repo.
