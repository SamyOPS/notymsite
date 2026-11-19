import "server-only";
import { MEDIA_BUCKET } from "@/lib/supabase/env";
import type { AdminSession } from "./auth";
import { mediaPath } from "./media";

/**
 * Supprime du stockage les photos retirées d'un produit ou d'un article.
 * Les photos fournies avec le site (/products/…) ne sont pas concernées.
 * Un échec n'empêche pas l'enregistrement : la photo reste simplement
 * inutilisée dans le bucket.
 */
export async function removeMedia(
  supabase: AdminSession["supabase"],
  urls: string[],
): Promise<void> {
  const paths = urls.flatMap((url) => mediaPath(url) ?? []);
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  if (error) console.error("[admin] photos non supprimées", paths, error);
}
