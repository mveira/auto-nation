# Netlify deploy (car-sale / Car Nation)

This app lives in a **monorepo** at `apps/car-sale`. For the **car-sale** Netlify site to work (and not 404), do the following.

## 1. Base directory (required)

- In Netlify: **Site configuration → Build & deploy → Build settings → Edit**
- Set **Base directory** to: **`apps/car-sale`**
- **Build command:** `npm run build` (or leave blank to use the one from `netlify.toml`)
- **Publish directory:** leave **empty** (the Next.js plugin sets it)

Save and trigger a **new deploy**.

## 2. Don’t skip the Next.js plugin

- **Site configuration → Environment variables**
- If **`NETLIFY_NEXT_PLUGIN_SKIP`** exists, set it to **`false`** or delete it.

## 3. Two sites, one repo

If you have both **services-web** and **car-sale** on Netlify:

- **services-web** site → Base directory: **`apps/services-web`**
- **car-sale** site → Base directory: **`apps/car-sale`**

Each site is a separate Netlify site linked to the same repo; the Base directory tells Netlify which app to build.
