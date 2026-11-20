import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type { Brand, Category, Product } from "@/types/catalog";
import type { Tables } from "@/types/database";

export type CatalogData = {
  categories: Category[];
  brands: Brand[];
  /** Produits visibles, dans l'ordre « les plus commandés ». */
  products: Product[];
};

type CategoryRow = Pick<
  Tables<"categories">,
  "id" | "slug" | "name" | "description" | "parent_id" | "sort"
>;
type BrandRow = Pick<Tables<"brands">, "id" | "slug" | "name" | "logo_url">;

/** Conversion des lignes de la base vers les types du site (logique pure). */
export function toCatalogData(rows: {
  categories: CategoryRow[];
  brands: BrandRow[];
  products: Tables<"products">[];
}): CatalogData {
  const categorySlugs = new Map(rows.categories.map((c) => [c.id, c.slug]));
  const brandSlugs = new Map(rows.brands.map((b) => [b.id, b.slug]));

  return {
    categories: rows.categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      parentSlug: c.parent_id ? (categorySlugs.get(c.parent_id) ?? null) : null,
      sort: c.sort,
    })),
    brands: rows.brands.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      logoUrl: b.logo_url,
    })),
    products: rows.products.flatMap((p) => {
      const categorySlug = categorySlugs.get(p.category_id);
      if (!categorySlug) return [];
      return [
        {
          id: p.id,
          slug: p.slug,
          sku: p.sku,
          name: p.name,
          brandSlug: p.brand_id ? (brandSlugs.get(p.brand_id) ?? null) : null,
          categorySlug,
          volume: p.volume,
          unitsPerPack: p.units_per_pack,
          packLabel: p.pack_label,
          description: p.description,
          images: p.images,
          isBestSeller: p.is_best_seller,
          isNew: p.is_new,
          isPromo: p.is_promo,
          inStock: p.in_stock,
          featured: p.featured,
          popularity: p.popularity,
          priceFromHtCents: p.price_from_ht_cents,
          legacyId: p.legacy_id,
          createdAt: p.created_at,
        },
      ];
    }),
  };
}

/** Taille d'une page de résultats (le maximum renvoyé par l'API Supabase). */
const PAGE = 1000;

/** Catalogue complet depuis Supabase (quelques centaines de produits au plus). */
export async function fetchCatalog(): Promise<CatalogData> {
  const supabase = createPublicClient();

  const [categories, brands] = await Promise.all([
    supabase
      .from("categories")
      .select("id, slug, name, description, parent_id, sort")
      .order("sort")
      .order("name"),
    supabase.from("brands").select("id, slug, name, logo_url").order("name"),
  ]);
  if (categories.error) throw categories.error;
  if (brands.error) throw brands.error;

  const products: Tables<"products">[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("published", true)
      .order("popularity", { ascending: false })
      .order("created_at")
      .order("name")
      // Ordre total : la pagination ne saute ni ne double aucun produit.
      .order("id")
      .range(from, from + PAGE - 1);
    if (error) throw error;
    products.push(...data);
    if (data.length < PAGE) break;
  }

  return toCatalogData({
    categories: categories.data,
    brands: brands.data,
    products,
  });
}
