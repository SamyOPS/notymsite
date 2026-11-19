import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { supabaseEnv } from "@/lib/supabase/env";
import {
  checkPath,
  parseCheckedPath,
  type KnownPaths,
  type RouteCheck,
} from "./routing";

/**
 * Adresses connues, chargées depuis Supabase pour proxy.ts. Gardées en
 * mémoire une minute ; une adresse inconnue force un rechargement (au plus
 * toutes les 5 secondes), pour qu'un produit tout juste créé dans l'admin soit
 * aussitôt accessible.
 */

const MAX_AGE_MS = 60_000;
const MIN_RELOAD_MS = 5_000;

let cached: { known: KnownPaths; loadedAt: number } | null = null;
let pending: Promise<KnownPaths> | null = null;

async function fetchKnownPaths(): Promise<KnownPaths> {
  const { url, publishableKey } = supabaseEnv();
  const supabase = createClient<Database>(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const [products, categories, articles] = await Promise.all([
    supabase
      .from("products")
      .select("slug, legacy_id")
      .eq("published", true)
      .range(0, 9999),
    supabase.from("categories").select("slug").range(0, 9999),
    supabase
      .from("articles")
      .select("slug")
      .eq("published", true)
      .range(0, 9999),
  ]);
  if (products.error) throw products.error;
  if (categories.error) throw categories.error;
  if (articles.error) throw articles.error;

  return {
    products: new Set(products.data.map((p) => p.slug)),
    categories: new Set(categories.data.map((c) => c.slug)),
    articles: new Set(articles.data.map((a) => a.slug)),
    legacyProducts: new Map(
      products.data.flatMap((p) =>
        p.legacy_id === null ? [] : [[p.legacy_id, p.slug] as const],
      ),
    ),
  };
}

async function getKnownPaths(maxAgeMs: number): Promise<KnownPaths> {
  if (cached && Date.now() - cached.loadedAt < maxAgeMs) return cached.known;
  pending ??= fetchKnownPaths()
    .then((known) => {
      cached = { known, loadedAt: Date.now() };
      return known;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}

export async function checkCatalogPath(pathname: string): Promise<RouteCheck> {
  const path = parseCheckedPath(pathname);
  if (!path) return { kind: "ok" };
  try {
    const result = checkPath(path, await getKnownPaths(MAX_AGE_MS));
    if (result.kind !== "not-found") return result;
    return checkPath(path, await getKnownPaths(MIN_RELOAD_MS));
  } catch (error) {
    // Base injoignable : on laisse la page s'afficher (elle gère elle-même
    // l'absence de contenu) plutôt que de renvoyer une fausse 404.
    console.error("[proxy] adresses du catalogue indisponibles", error);
    return { kind: "ok" };
  }
}
