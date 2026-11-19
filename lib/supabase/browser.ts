import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { supabaseEnv } from "./env";

/**
 * Client navigateur de l'espace admin, qui reprend la session des cookies.
 * Sert uniquement à envoyer les photos dans le stockage (policies admin).
 */
export function createBrowserSupabase() {
  const { url, publishableKey } = supabaseEnv();
  return createBrowserClient<Database>(url, publishableKey);
}
