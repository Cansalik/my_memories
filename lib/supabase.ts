import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(url, key);

// Server-side admin client (uses service role key — never expose to browser)
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? key;
  return createClient(url, serviceKey);
}
