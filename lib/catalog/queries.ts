import "server-only";
import { cacheTag } from "next/cache";
import type {
  Brand,
  Category,
  Product,
  ProductBadge,
  ProductCardData,
} from "@/types/catalog";
import { brands, categories, products } from "./data";
import {
  searchProducts,
  type CatalogFilters,
  type CatalogSearchResult,
} from "./search";

/**
 * Accès au catalogue. Seule cette couche connaît la source des données :
 * aujourd'hui un fichier local, demain Supabase. Les pages n'en dépendent pas.
 */

export const CATALOG_TAG = "catalog";

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  return [...categories].sort((a, b) => a.sort - b.sort);
}

export async function getBrands(): Promise<Brand[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  return [...brands].sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

export async function getFeaturedProducts(
  limit = 4,
): Promise<ProductCardData[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  return products
    .filter((p) => p.featured)
    .slice(0, limit)
    .map(toCardData);
}

export function toCardData(product: Product): ProductCardData {
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
  const product = products.find((p) => p.slug === slug);
  return product ? toCardData(product) : null;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  "use cache";
  cacheTag(CATALOG_TAG);
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
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
  const result = searchProducts(products, filters, { brands, categories });
  return { ...result, items: result.items.map(toCardData) };
}

export type ProductDetail = {
  product: Product;
  brand: Brand | null;
  category: Category | null;
};

export async function getProductDetail(
  slug: string,
): Promise<ProductDetail | null> {
  "use cache";
  cacheTag(CATALOG_TAG);
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  return {
    product,
    brand: brands.find((b) => b.slug === product.brandSlug) ?? null,
    category: categories.find((c) => c.slug === product.categorySlug) ?? null,
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
  const current = products.find((p) => p.id === productId);
  if (!current) return [];
  return products
    .filter(
      (p) => p.id !== productId && p.categorySlug === current.categorySlug,
    )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map(toCardData);
}
