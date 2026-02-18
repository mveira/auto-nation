# Deploying Strapi to Railway

## Prerequisites
- Railway account (https://railway.app)
- Repository connected to Railway

## Steps

### 1. Create Railway project
- New Project → Deploy from GitHub repo
- Set **Root Directory** to `apps/cms`

### 2. Add Postgres
- Click **+ New** → **Database** → **PostgreSQL**
- Railway auto-provisions and sets `DATABASE_URL` as a service variable

### 3. Set environment variables

In the Strapi service settings, add:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `HOST` | `0.0.0.0` |
| `PORT` | `1337` |
| `DATABASE_CLIENT` | `postgres` |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (Railway reference) |
| `DATABASE_SSL` | `true` |
| `APP_KEYS` | Generate: `openssl rand -base64 16` (4 comma-separated) |
| `API_TOKEN_SALT` | Generate: `openssl rand -base64 16` |
| `ADMIN_JWT_SECRET` | Generate: `openssl rand -base64 16` |
| `TRANSFER_TOKEN_SALT` | Generate: `openssl rand -base64 16` |
| `JWT_SECRET` | Generate: `openssl rand -base64 16` |
| `ENCRYPTION_KEY` | Generate: `openssl rand -base64 16` |

### 4. Build & start commands
Railway detects `package.json` automatically.

- **Build**: `npm run build`
- **Start**: `npm run start`

These are already defined in the Strapi `package.json`.

### 5. Healthcheck
Set healthcheck path to `/_health` (Strapi built-in).

### 6. Configure public permissions

After first deploy and admin account creation:

1. Log into Strapi admin at `https://<your-railway-url>/admin`
2. Go to **Settings → Users & Permissions → Roles → Public**
3. Enable the following actions:
   - **Vehicle**: `find`, `findOne`
   - **Site-setting**: `find`
   - **Service**: `find`, `findOne`
4. Save

All other actions (create, update, delete) remain disabled for Public.

### 7. Create API token for sync/writes

1. Go to **Settings → API Tokens → Create new API Token**
2. Name: `sync-worker` (or similar)
3. Type: **Full access** (or custom with create/update on Vehicle)
4. Copy the token — store it as `STRAPI_API_TOKEN` in the sync worker's env

### Notes
- Railway auto-restarts on deploy
- Strapi admin panel is built at deploy time (`npm run build`)
- Postgres connection uses `DATABASE_URL` connectionString (already configured in `config/database.ts`)
