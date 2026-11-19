import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createSessionClient } from "@/lib/supabase/server";
import { LOGIN_PATH } from "./session-proxy";

export type AdminSession = {
  supabase: Awaited<ReturnType<typeof createSessionClient>>;
  userId: string;
  email: string | null;
};

/**
 * Compte connecté, s'il fait partie des administrateurs (table admins).
 * getClaims() vérifie la signature du jeton : on ne se fie pas aux cookies.
 */
export const getAdmin = cache(async (): Promise<AdminSession | null> => {
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return null;
  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (!admin) return null;
  const email = data.claims.email;
  return { supabase, userId, email: typeof email === "string" ? email : null };
});

/**
 * À appeler en tête de chaque page et de chaque action de l'admin : renvoie
 * vers la connexion si le visiteur n'est pas administrateur. La RLS protège
 * de toute façon les données ; ce contrôle évite d'afficher une page vide.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const admin = await getAdmin();
  if (!admin) redirect(LOGIN_PATH);
  return admin;
}
