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
  // L'API renvoie au plus 1 000 lignes par requête : on lit par pages.
  const [products, categories, articles] = await Promise.all([
    fetchAllPages((from, to) =>
      supabase
        .from("products")
        .select("slug, legacy_id")
        .eq("published", true)
        .order("slug")
        .range(from, to),
    ),
    fetchAllPages((from, to) =>
      supabase.from("categories").select("slug").order("slug").range(from, to),
    ),
    fetchAllPages((from, to) =>
      supabase
        .from("articles")
        .select("slug")
        .eq("published", true)
        .order("slug")
        .range(from, to),
    ),
  ]);

  return {
    products: new Set(products.map((p) => p.slug)),
    categories: new Set(categories.map((c) => c.slug)),
    articles: new Set(articles.map((a) => a.slug)),
    legacyProducts: new Map(
      products.flatMap((p) =>
        p.legacy_id === null ? [] : [[p.legacy_id, p.slug] as const],
      ),
    ),
  };
}

const PAGE = 1000;

async function fetchAllPages<T>(
  query: (
    from: number,
    to: number,
  ) => PromiseLike<{ data: T[] | null; error: unknown }>,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await query(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
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
