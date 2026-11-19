import { MEDIA_BUCKET } from "@/lib/supabase/env";

/** Début des URL publiques des photos envoyées depuis l'admin. */
export function mediaBaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url
    ? `${url.replace(/\/$/, "")}/storage/v1/object/public/${MEDIA_BUCKET}/`
    : null;
}

/**
 * Photo acceptée dans un formulaire : envoyée dans le bucket media, ou
 * fournie avec le site (/products/…, photos reprises de l'ancien catalogue).
 */
export function isAllowedImageUrl(url: string): boolean {
  if (/^\/products\/[a-z0-9-]+\.(webp|jpe?g|png)$/.test(url)) return true;
  const base = mediaBaseUrl();
  return (
    base !== null &&
    url.startsWith(base) &&
    /^(products|articles)\/[a-z0-9-]+\.(webp|jpe?g|png)$/.test(
      url.slice(base.length),
    )
  );
}

/** Chemin dans le bucket d'une photo envoyée depuis l'admin, sinon null. */
export function mediaPath(url: string): string | null {
  const base = mediaBaseUrl();
  return base && url.startsWith(base) ? url.slice(base.length) : null;
}
