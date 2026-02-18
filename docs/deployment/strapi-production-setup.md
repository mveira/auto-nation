# Strapi Production Setup (Railway)

Production deployment guide for `apps/cms` (Strapi 5) on Railway with PostgreSQL.

---

## Prerequisites

- Railway account with a project created
- PostgreSQL add-on provisioned in Railway (provides `DATABASE_URL`)
- Netlify site URLs known for both car-sale and services-web

---

## Environment Variables (Railway)

Set all of the following in the Railway service settings:

### App Secrets

| Variable | Description | Example |
|---|---|---|
| `APP_KEYS` | 4 comma-separated base64 keys | `key1,key2,key3,key4` |
| `API_TOKEN_SALT` | Random string for API token hashing | Generate with `openssl rand -base64 16` |
| `ADMIN_JWT_SECRET` | JWT secret for admin panel auth | Generate with `openssl rand -base64 16` |
| `TRANSFER_TOKEN_SALT` | Salt for transfer tokens | Generate with `openssl rand -base64 16` |
| `JWT_SECRET` | JWT secret for users-permissions plugin | Generate with `openssl rand -base64 16` |

### Database

| Variable | Description |
|---|---|
| `DATABASE_CLIENT` | `postgres` |
| `DATABASE_URL` | Provided by Railway Postgres add-on |

### Server

| Variable | Description |
|---|---|
| `HOST` | `0.0.0.0` |
| `PORT` | Railway sets this; Strapi must read it (default 1337) |
| `NODE_ENV` | `production` |

### CORS

| Variable | Description | Example |
|---|---|---|
| `CORS_ORIGINS` | Comma-separated allowed origins | `https://site1.netlify.app,https://site2.netlify.app` |

In local development, `CORS_ORIGINS` defaults to `http://localhost:3000` if not set.

---

## Deploy Steps

1. Connect Railway to the GitHub repo
2. Set the **root directory** to `apps/cms`
3. Set **build command**: `npm ci && npm run build`
4. Set **start command**: `npm run start`
5. Add all environment variables listed above
6. Deploy — Railway will detect Node.js automatically
7. Verify health: `GET https://<your-railway-url>/admin` should load the admin panel (primary), `GET /api` should return a response (secondary)

---

## Security Configuration

### CORS (implemented)

Configured in `apps/cms/config/middlewares.ts`. Origins are read from the `CORS_ORIGINS` environment variable (comma-separated). Only listed origins can make cross-origin requests to the API.

Allowed methods: `GET`, `POST`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`
Allowed headers: `Content-Type`, `Authorization`, `Origin`, `Accept`

Update `CORS_ORIGINS` in Railway whenever site URLs change.

### Security Headers (implemented)

The `strapi::security` middleware wraps `koa-helmet` and provides these headers by default:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection` (legacy, but included)
- `Strict-Transport-Security` (may be applied via HTTPS/proxy)
- `Content-Security-Policy`

CSP is customized in `middlewares.ts` to allow image/media sources from:
- Strapi itself (`'self'`, `data:`, `blob:`)
- Strapi marketplace assets (`market-assets.strapi.io`)
- Auto Trader CDN (`cdn.autotrader.co.uk`)

Add additional image source domains to the CSP `img-src` directive in `middlewares.ts` if needed.

### Public API Permissions (manual step)

Security Mode A: public read-only access.

After first deploy, configure in the Strapi admin panel:

1. Go to **Settings > Users & Permissions > Roles > Public**
2. For each content type (`vehicle`, `service`, `site-setting`):
   - Enable **find** and **findOne** only
   - Do NOT enable create, update, or delete
3. Save

All write operations (sync, admin updates) require authenticated API tokens.

### Rate Limiting (recommended, not implemented)

Strapi 5 does not include rate limiting as a built-in middleware. Adding it would require a new npm dependency, so it is documented here as a recommended step rather than implemented.

Options to add rate limiting:

- **Railway level** — configure request limits in Railway service settings if available
- **Cloudflare proxy** — place Cloudflare in front of the Railway URL and use Cloudflare rate limiting rules
- **Application level** — install a koa rate-limit package (e.g., `koa2-ratelimit`) and register it as a custom Strapi middleware

For most use cases, Cloudflare proxy is the simplest and most effective option since it also provides DDoS protection and caching.

---

## Admin Access

- The first admin account is created on the first visit to `/admin` after deploy
- Use a strong password — this account has full CMS access
- Additional admin users can be invited from Settings > Administration panel

---

## Generate Secrets (Quick Reference)

Run these locally to generate all required secrets:

```bash
echo "APP_KEYS=$(openssl rand -base64 16),$(openssl rand -base64 16),$(openssl rand -base64 16),$(openssl rand -base64 16)"
echo "API_TOKEN_SALT=$(openssl rand -base64 16)"
echo "ADMIN_JWT_SECRET=$(openssl rand -base64 16)"
echo "TRANSFER_TOKEN_SALT=$(openssl rand -base64 16)"
echo "JWT_SECRET=$(openssl rand -base64 16)"
```

Copy the output directly into Railway environment variables.
