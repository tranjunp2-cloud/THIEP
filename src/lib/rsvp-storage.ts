import "server-only";

export type RsvpRecord = {
  id: string;
  wedding: string;
  guest_key: string;
  name: string;
  attendance: "yes" | "no";
  party_size: number;
  side: string;
  message: string;
  created_at: string;
};

export function isRsvpConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Lưu qua Supabase REST bằng khoá service role — chỉ chạy trên server, không lộ ra trình duyệt. */
export async function saveRsvp(record: RsvpRecord) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("RSVP storage not configured");
  const endpoint = new URL("/rest/v1/wedding_rsvps?on_conflict=id", url);
  if (endpoint.protocol !== "https:") throw new Error("RSVP storage requires HTTPS");
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify(record),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`RSVP storage returned ${res.status}`);
}
