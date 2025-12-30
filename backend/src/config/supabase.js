import { createClient } from "@supabase/supabase-js";

let supabase;

export function getSupabase() {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error("Supabase env vars missing");
    }

    supabase = createClient(url, key);
  }

  return supabase;
}
