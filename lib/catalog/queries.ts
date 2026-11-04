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
