import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type TreeRecord = {
  id: string;
  planted_at: string;
  name: string | null;
  last_visited_at: string | null;
};

const idSchema = z.string().regex(/^[A-Za-z0-9_-]{6,32}$/);
const plantSchema = z.object({ id: idSchema, name: z.string().trim().max(80).nullable().optional() });

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Vercel.");
  return { url: url.replace(/\/$/, ""), key };
}

async function supabase(path: string, init: RequestInit = {}) {
  const { url, key } = config();
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
  });
}

export const getTree = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => ({ id: idSchema.parse(data.id) }))
  .handler(async ({ data }) => {
    const res = await supabase(`trees?id=eq.${encodeURIComponent(data.id)}&select=id,planted_at,name,last_visited_at&limit=1`);
    if (!res.ok) throw new Error(`Supabase read failed: ${res.status}`);
    const rows = (await res.json()) as TreeRecord[];
    if (!rows[0]) return null;
    await supabase(`trees?id=eq.${encodeURIComponent(data.id)}`, { method: "PATCH", body: JSON.stringify({ last_visited_at: new Date().toISOString() }) });
    return rows[0];
  });

export const plantTree = createServerFn({ method: "POST" })
  .validator((data: unknown) => plantSchema.parse(data))
  .handler(async ({ data }) => {
    const plantedAt = new Date().toISOString();
    const fallback: TreeRecord = {
      id: data.id,
      planted_at: plantedAt,
      name: data.name ?? null,
      last_visited_at: plantedAt,
    };

    try {
      const res = await supabase("trees", {
        method: "POST",
        headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
        body: JSON.stringify({ id: data.id, planted_at: plantedAt, name: data.name ?? null, last_visited_at: plantedAt }),
      });
      if (!res.ok) throw new Error(`Supabase write failed: ${res.status}`);
      const rows = (await res.json()) as TreeRecord[];
      if (rows[0]) return rows[0];

      const existing = await supabase(`trees?id=eq.${encodeURIComponent(data.id)}&select=id,planted_at,name,last_visited_at&limit=1`);
      if (!existing.ok) throw new Error(`Supabase read after plant failed: ${existing.status}`);
      const existingRows = (await existing.json()) as TreeRecord[];
      if (existingRows[0]) return existingRows[0];
    } catch (error) {
      console.error("Unable to persist planted tree to Supabase:", error);
    }

    // Never strand the guest on the name screen because persistence is slow or
    // temporarily unavailable. The client can continue the experience using
    // this record while the database configuration is corrected.
    return fallback;
  });
