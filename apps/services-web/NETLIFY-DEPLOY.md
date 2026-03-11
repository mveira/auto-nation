# Netlify deploy checklist (fix 404)

If you see **"Page not found"** on every URL (including `/`), Netlify is not running the Next.js app. Use this checklist.

## 1. Build from this app (monorepo)

The repo root has a **root `netlify.toml`** that sets `base = "apps/services-web"` so Netlify builds this app.

In Netlify:

- **Site configuration → Build & deploy → Build settings → Edit settings**
- **Base directory:** `apps/services-web` (must match the app folder)
- **Build command:** `npm run build` (or leave blank to use the one from `netlify.toml`)
- **Publish directory:** leave **empty** (the Next.js plugin sets it)

Save and trigger a **new deploy**.

## 2. Do not skip the Next.js plugin

- **Site configuration → Environment variables**
- If **`NETLIFY_NEXT_PLUGIN_SKIP`** exists, set it to **`false`** or delete it.
- If it is `true`, the Next.js runtime is disabled and every request returns 404.

## 3. Check the deploy log

After a deploy, open **Deploys → [latest deploy] → Deploy log** and confirm:

- Build runs in `apps/services-web` (or you see `base = "apps/services-web"`).
- `npm install` and `npm run build` run without errors.
- A step like **"Installing Next.js runtime"** or **"@netlify/plugin-nextjs"** appears.
- Build finishes with success.

If the build fails or the plugin never runs, the site will 404.

## 4. Check deploy contents

In **Deploys → [latest deploy] → Deploy file explorer** (or similar), you should see:

- Netlify-generated files (e.g. server handler, functions), not only a bare `index.html`.

If you only see a single `index.html` or almost nothing, the Next.js plugin did not run and you’ll get 404.

## 5. Root vs app config

- **Repo root:** `/netlify.toml` — sets `base = "apps/services-web"` and build/plugin so Netlify builds this app.
- **This app:** `apps/services-web/netlify.toml` — extra headers; build is driven by the root file.

After changing Base directory or env vars, trigger a **new deploy** (e.g. **Trigger deploy → Deploy site**).
