/**
 * Paramètres publics du projet Supabase (Dashboard > Project Settings > API Keys).
 * Les accès à process.env restent littéraux pour être remplacés dans le
 * code envoyé au navigateur.
 */
export function supabaseEnv(): { url: string; publishableKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error(
      "Supabase n'est pas configuré : renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (voir .env.example).",
    );
  }
  return { url, publishableKey };
}

/** Nom du bucket de stockage des photos (produits, actualités). */
export const MEDIA_BUCKET = "media";
