# Car Nation — Services Website

Next.js App Router site for vehicle servicing, repairs, and MOT bookings.

## Setup

```bash
cd apps/services-web
npm install
npm run dev        # runs on http://localhost:3001
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes | API key from [resend.com](https://resend.com) |
| `EMAIL_FROM` | No | Sender address (default: `onboarding@resend.dev`) |
| `EMAIL_TO` | No | Destination for form submissions (default: placeholder) |

## Netlify Deployment

1. Create a new Netlify site
2. Set **base directory** to `apps/services-web`
3. Build command and publish dir are set in `netlify.toml`
4. Add environment variables in Netlify site settings
5. Deploy

## Placeholders

The following values use placeholders and must be updated before go-live:

- **Phone number** — used in Footer and Contact page (`07700 900123`)
- **Email address** — used in Contact page (`services@carnation.co.uk`)
- **Business address** — used in Footer and Contact page
- **EMAIL_TO** env var — destination for form submissions
- **Logo** — Navigation currently uses text; replace with image when available

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, value props, services preview |
| `/services` | Full services list with booking CTAs |
| `/contact` | Contact form (Resend) + contact info |
| `/book` | Booking form (Resend) with service selector |

## Tech

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui primitives
- Resend for transactional email
- Netlify deployment
