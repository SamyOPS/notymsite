import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Client avec la clé secrète : ignore la RLS. Réservé aux écritures que le
 * serveur fait pour le compte du public après validation (enregistrement des
 * demandes de devis et de contact). Ne jamais l'utiliser pour l'admin.
 *
 * Renvoie null si la clé n'est pas configurée.
 */
export function createSecretClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) return null;
  return createClient<Database>(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
