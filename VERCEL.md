# Deploy THIEP to Vercel

This repo now builds with standard Next.js. `vercel.json` overrides the earlier Vite settings, including the old `dist` output directory.

## Vercel project settings

- Framework Preset: **Next.js**
- Root Directory: repo root (`./`)
- Build Command: turn Override off (the repo specifies `npm run build`)
- Output Directory: turn Override off (Next.js uses `.next`)
- Install Command: turn Override off (the repo specifies `npm ci`)
- Development Command: turn Override off
- Node.js: 22.x or 24.x

Save settings and deploy the latest commit on `main`. Do not redeploy the old commit that still ran `vite build`. No project deletion or re-import is needed.

## Enable RSVP on Vercel

The page, images, animation and music work without a database. RSVP remains visibly unavailable until server credentials are configured; the API never claims a reply was saved without storage.

1. Create/open a Supabase project.
2. In SQL Editor, run `supabase/rsvps.sql` once.
3. In Vercel → Settings → Environment Variables, add:
   - `SUPABASE_URL`: the Supabase project URL, for example `https://YOUR_PROJECT.supabase.co`.
   - `SUPABASE_SERVICE_ROLE_KEY`: the server-only `service_role` API key (legacy JWT key under the project's API Keys settings).
4. Apply to Production (and Preview if needed), then redeploy the latest commit.
5. Submit one test reply and confirm a row appears in Supabase Table Editor → `rsvps`.

Never use a `NEXT_PUBLIC_` prefix for the service role key or put it in GitHub. Keep row-level security enabled. The SQL script grants no browser/anonymous access; only the server saves records.

Existing RSVP records in the Sites D1 database are **not** automatically copied to Supabase. The existing Sites deployment continues to use its own database.

## Local commands

- `npm run dev`: Next.js development
- `npm run build`: production Next.js build
- `npm start`: run the Next.js build
- `node --test tests/rsvp-storage.test.mjs`: storage contract checks (Node 22.18+ or 24)

For the original Cloudflare/Sites target, use `npm run dev:sites`, `npm run build:sites`, and `npm run start:sites`. Vite aliases the storage adapter to Cloudflare D1 for that target.
