create table if not exists public.trees (
  id text primary key check (id ~ '^[A-Za-z0-9_-]{6,32}$'),
  planted_at timestamptz not null,
  name text,
  last_visited_at timestamptz
);

alter table public.trees enable row level security;

-- The app uses the server-only Supabase service-role key, so browser clients do not need table access.
-- Keep RLS enabled and create no public policies.
create index if not exists trees_planted_at_idx on public.trees (planted_at);
