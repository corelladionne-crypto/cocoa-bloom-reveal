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

For about 400 tags, generate 400 unique IDs (8–10 characters), create a CSV with `id,url`, then use the CSV with your preferred QR/label printer workflow. Keep the CSV as the private event inventory.

Example rows:

`A7K92B,https://YOUR-DOMAIN/tree/A7K92B`
`Q4M81Z,https://YOUR-DOMAIN/tree/Q4M81Z`

## Checking saved trees
Supabase → Table Editor → `public.trees` shows one row per guest. `planted_at` is the authoritative growth start time and `last_visited_at` updates when a saved tree is scanned.

## Growth timing
`GROWTH_DURATION_HOURS` is currently 36 in `src/routes/index.tsx`. Growth stage is computed from elapsed time; it is not an animation replay.
