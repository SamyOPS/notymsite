/**
 * Existence des pages catalogue et actualités, vérifiée par proxy.ts avant le
 * rendu pour renvoyer un vrai statut 404 (une fois le streaming commencé,
 * Next.js ne peut plus changer le statut 200). Logique pure : la liste des
 * adresses connues est chargée par ./known-paths.ts.
 */

export type KnownPaths = {
  products: ReadonlySet<string>;
  categories: ReadonlySet<string>;
  articles: ReadonlySet<string>;
  /** Identifiant de l'ancien site (/product/1) → slug du produit. */
  legacyProducts: ReadonlyMap<number, string>;
};

export type RouteCheck =
  | { kind: "ok" }
  | { kind: "not-found" }
  | { kind: "redirect"; location: string };

type CheckedPath =
  | { type: "products" | "categories" | "articles"; slug: string }
  | { type: "legacy"; id: number };

/** Adresse soumise au contrôle, ou null si elle n'en relève pas. */
export function parseCheckedPath(pathname: string): CheckedPath | null {
  const patterns = [
    [/^\/produit\/([^/]+)\/?$/, "products"],
    [/^\/catalogue\/([^/]+)\/?$/, "categories"],
    [/^\/actualites\/([^/]+)\/?$/, "articles"],
  ] as const;
  for (const [pattern, type] of patterns) {
    const match = pattern.exec(pathname);
    if (match) return { type, slug: safeDecode(match[1] ?? "") };
  }
  const legacy = /^\/product\/(\d{1,9})\/?$/.exec(pathname);
  if (legacy) return { type: "legacy", id: Number(legacy[1]) };
  return null;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function checkPath(
  path: CheckedPath | null,
  known: KnownPaths,
): RouteCheck {
  if (!path) return { kind: "ok" };
  if (path.type === "legacy") {
    const slug = known.legacyProducts.get(path.id);
    // Ancien identifiant inconnu : aucune route ne correspond, Next.js renvoie 404.
    return slug
      ? { kind: "redirect", location: `/produit/${slug}` }
      : { kind: "ok" };
  }
  return known[path.type].has(path.slug)
    ? { kind: "ok" }
    : { kind: "not-found" };
}
