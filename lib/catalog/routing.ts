import { categories, products } from "./data";

/**
 * Existence des pages catalogue, vérifiée par proxy.ts avant le rendu pour
 * renvoyer un vrai statut 404 (une fois le streaming commencé, Next.js ne
 * peut plus changer le statut 200).
 * À remplacer par une liste mise en cache quand les données viendront de Supabase.
 */
const productSlugs = new Set(products.map((p) => p.slug));
const categorySlugs = new Set(categories.map((c) => c.slug));

export function isKnownCatalogPath(pathname: string): boolean {
  const product = /^\/produit\/([^/]+)\/?$/.exec(pathname);
  if (product) return productSlugs.has(decodeURIComponent(product[1] ?? ""));
  const category = /^\/catalogue\/([^/]+)\/?$/.exec(pathname);
  if (category) return categorySlugs.has(decodeURIComponent(category[1] ?? ""));
  return true;
}
