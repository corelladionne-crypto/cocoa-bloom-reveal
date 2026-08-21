# Rooted persistence + QR tags

## Supabase setup
Run `supabase/schema.sql` in the Supabase SQL editor.

Add these Vercel environment variables to Production (and Preview if desired):

- `SUPABASE_URL` — the Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — the server-only service-role key

Do not prefix the service-role key with `VITE_` and do not expose it to the browser.

## Guest QR links
Each physical tag should contain a URL like:

`https://YOUR-DOMAIN/tree/A7K92B`

The short ID is the primary key in `public.trees`. The app computes growth from `planted_at`, so the same URL works on any device.

Generate a batch of 400 links with:

`node scripts/generate-guest-tags.mjs 400 https://YOUR-DOMAIN/tree`

That writes `guest-tags.csv` with unique `id,url` rows. Use that CSV as the source for your QR/label-printing workflow and keep it as the private event inventory.

## Checking saved trees
Supabase → Table Editor → `public.trees` shows one row per guest. `planted_at` is the authoritative growth start time and `last_visited_at` updates when a saved tree is scanned.

## Growth timing
`GROWTH_DURATION_HOURS` is currently 24 in `src/routes/index.tsx`. Growth stage is computed from elapsed time; it is not an animation replay.
