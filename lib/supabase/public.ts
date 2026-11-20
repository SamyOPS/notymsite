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
    // Réponses non compressées : pendant `next build`, les grosses réponses
    // gzip (pages de 1 000 produits, ~580 Ko) arrivaient parfois tronquées
    // puis illisibles. Le catalogue est mis en cache : le surpoids est sans effet.
    global: { headers: { "Accept-Encoding": "identity" } },
  });
}
