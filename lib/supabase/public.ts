import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { supabaseEnv } from "./env";

/**
 * Client anonyme, sans session : lectures publiques (catalogue, actualités),
 * utilisable dans les fonctions « use cache ». La RLS ne lui laisse voir que
 * ce qui est publié.
 */
export function createPublicClient() {
  const { url, publishableKey } = supabaseEnv();
  return createClient<Database>(url, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
