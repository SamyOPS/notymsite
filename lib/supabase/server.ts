import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import type { Database } from "@/types/database";
import { supabaseEnv } from "./env";

/**
 * Client lié à la session de l'utilisateur (cookies) : espace admin.
 * Les droits sont ceux du compte connecté, appliqués par la RLS.
 * Un nouveau client par requête : ne jamais le partager.
 */
export async function createSessionClient() {
  // Requête réelle uniquement : la vérification du jeton lit l'heure courante,
  // ce que Next.js refuse pendant un prérendu (même avec les cookies).
  await connection();
  const cookieStore = await cookies();
  const { url, publishableKey } = supabaseEnv();
  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Appel depuis un Server Component (cookies en lecture seule) :
          // proxy.ts rafraîchit la session à chaque requête /admin.
        }
      },
    },
  });
}
