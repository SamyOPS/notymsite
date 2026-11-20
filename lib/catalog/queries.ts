import "server-only";
import { cacheTag } from "next/cache";
import type {
  Brand,
  Category,
  Product,
  ProductBadge,
  ProductCardData,
  QuoteProduct,
} from "@/types/catalog";
import {
  searchProducts,
  type CatalogFilters,
  type CatalogSearchResult,
} from "./search";
import { fetchCatalog, type CatalogData } from "./source";

/**
 * Accès au catalogue. Seule cette couche connaît la source des données
 * (Supabase) : les pages n'en dépendent pas.
 *
 * Le catalogue entier est lu en une fois et mis en cache. L'espace admin
 * appelle updateTag(CATALOG_TAG) après chaque modification : le site affiche
 * aussitôt les changements.
 */

export const CATALOG_TAG = "catalog";

async function loadCatalog(): Promise<CatalogData> {
  "use cache";
  cacheTag(CATALOG_TAG);
  return fetchCatalog();
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  const { categories } = await loadCatalog();
  return [...categories].sort((a, b) => a.sort - b.sort);
}

export async function getBrands(): Promise<Brand[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  const { brands } = await loadCatalog();
  return [...brands].sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

/** Marques les plus représentées au catalogue, et le nombre total de marques. */
export async function getTopBrands(
  limit = 12,
): Promise<{ names: string[]; total: number }> {
  "use cache";
  cacheTag(CATALOG_TAG);
  const { products, brands } = await loadCatalog();
  const counts = new Map<string, number>();
  for (const p of products) {
    if (p.brandSlug)
      counts.set(p.brandSlug, (counts.get(p.brandSlug) ?? 0) + 1);
  }
  const ranked = brands
    .filter((b) => counts.has(b.slug))
    .sort((a, b) => (counts.get(b.slug) ?? 0) - (counts.get(a.slug) ?? 0));
  return {
    names: ranked.slice(0, limit).map((b) => b.name),
    total: ranked.length,
  };
}

export async function getFeaturedProducts(
  limit = 4,
): Promise<ProductCardData[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  const { products, brands } = await loadCatalog();
  return products
    .filter((p) => p.featured)
    .slice(0, limit)
    .map((p) => toCardData(p, brands));
}

function toCardData(product: Product, brands: Brand[]): ProductCardData {
  const badges: ProductBadge[] = [];
  if (product.isBestSeller) badges.push("best-seller");
  if (product.isPromo) badges.push("promo");
  if (product.isNew) badges.push("new");
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: brands.find((b) => b.slug === product.brandSlug)?.name ?? "",
    packLabel: product.packLabel,
    volume: product.volume,
    imageUrl: product.images[0] ?? null,
    badges,
    inStock: product.inStock,
    priceFromHtCents: product.priceFromHtCents,
  };
}

export async function getProductCardBySlug(
  slug: string,
): Promise<ProductCardData | null> {
  "use cache";
  cacheTag(CATALOG_TAG);
  const { products, brands } = await loadCatalog();
  const product = products.find((p) => p.slug === slug);
  return product ? toCardData(product, brands) : null;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  "use cache";
  cacheTag(CATALOG_TAG);
  const { categories } = await loadCatalog();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  const { products } = await loadCatalog();
  return products.map((p) => p.slug);
}

export type CatalogPage = Omit<CatalogSearchResult, "items"> & {
  items: ProductCardData[];
};

/** Résultats du catalogue pour des filtres (les filtres font partie de la clé de cache). */
export async function searchCatalog(
  filters: CatalogFilters,
): Promise<CatalogPage> {
  "use cache";
  cacheTag(CATALOG_TAG);
  const { products, brands, categories } = await loadCatalog();
  const result = searchProducts(products, filters, { brands, categories });
  return {
    ...result,
    items: result.items.map((p) => toCardData(p, brands)),
  };
}

export type ProductDetail = {
  product: Product;
  brand: Brand | null;
  category: Category | null;
  /** Univers parent de la catégorie (Boissons…), s'il existe. */
  universe: Category | null;
};

export async function getProductDetail(
  slug: string,
): Promise<ProductDetail | null> {
  "use cache";
  cacheTag(CATALOG_TAG);
  const { products, brands, categories } = await loadCatalog();
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  const category =
    categories.find((c) => c.slug === product.categorySlug) ?? null;
  return {
    product,
    brand: brands.find((b) => b.slug === product.brandSlug) ?? null,
    category,
    universe: categories.find((c) => c.slug === category?.parentSlug) ?? null,
  };
}

/**
 * Produits de la même catégorie. À remplacer par « souvent commandés avec »
 * quand l'historique des demandes de devis permettra de le calculer.
 */
export async function getRelatedProducts(
  productId: string,
  limit = 4,
): Promise<ProductCardData[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  const { products, brands } = await loadCatalog();
  const current = products.find((p) => p.id === productId);
  if (!current) return [];
  return products
    .filter(
      (p) => p.id !== productId && p.categorySlug === current.categorySlug,
    )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map((p) => toCardData(p, brands));
}

/** Produits d'une sélection de devis (les identifiants inconnus sont ignorés). */
export async function getQuoteProducts(ids: string[]): Promise<QuoteProduct[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  const { products, brands } = await loadCatalog();
  const wanted = new Set(ids);
  return products
    .filter((p) => wanted.has(p.id))
    .map((p) => ({ ...toCardData(p, brands), unitsPerPack: p.unitsPerPack }));
}
