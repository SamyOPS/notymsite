import type { SearchParamsRecord } from "@/lib/pagination";
import type { Brand, Category, Product } from "@/types/catalog";

/**
 * Recherche, filtres, tri et pagination du catalogue (logique pure).
 * Les filtres vivent dans l'URL : /catalogue/sodas-eaux?marque=coca-cola&tri=nom&page=2
 */

export const sortOptions = [
  { value: "populaires", label: "Les plus commandés" },
  { value: "nom", label: "Nom (A → Z)" },
  { value: "prix", label: "Prix croissant" },
  { value: "nouveautes", label: "Nouveautés" },
] as const;

export type SortKey = (typeof sortOptions)[number]["value"];
export const DEFAULT_SORT: SortKey = "populaires";
export const PAGE_SIZE = 12;

export type CatalogFilters = {
  q: string;
  /** Catégorie portée par le chemin (/catalogue/[categorie]), pas par la query. */
  category: string | null;
  brands: string[];
  packs: number[];
  inStockOnly: boolean;
  sort: SortKey;
  page: number;
};

const SLUG = /^[a-z0-9-]{1,60}$/;

function all(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/** Lit des paramètres d'URL non fiables et renvoie des filtres valides. */
export function parseCatalogParams(
  params: SearchParamsRecord,
  category: string | null = null,
): CatalogFilters {
  const q = (all(params.q)[0] ?? "").trim().slice(0, 100);
  const brands = [...new Set(all(params.marque).filter((v) => SLUG.test(v)))];
  const packs = [
    ...new Set(
      all(params.conditionnement)
        .map(Number)
        .filter((n) => Number.isInteger(n) && n > 0 && n < 10_000),
    ),
  ].sort((a, b) => a - b);
  const sortParam = all(params.tri)[0];
  const sort = sortOptions.some((o) => o.value === sortParam)
    ? (sortParam as SortKey)
    : DEFAULT_SORT;
  const pageParam = Number(all(params.page)[0]);
  const page = Number.isInteger(pageParam) && pageParam > 1 ? pageParam : 1;

  return {
    q,
    category,
    brands,
    packs,
    inStockOnly: all(params.dispo).includes("en-stock"),
    sort,
    page,
  };
}

/** URL du catalogue pour des filtres donnés (paramètres par défaut omis). */
export function buildCatalogHref(filters: CatalogFilters): string {
  const path = filters.category
    ? `/catalogue/${filters.category}`
    : "/catalogue";
  const query = new URLSearchParams();
  if (filters.q) query.set("q", filters.q);
  for (const brand of filters.brands) query.append("marque", brand);
  for (const pack of filters.packs)
    query.append("conditionnement", String(pack));
  if (filters.inStockOnly) query.set("dispo", "en-stock");
  if (filters.sort !== DEFAULT_SORT) query.set("tri", filters.sort);
  if (filters.page > 1) query.set("page", String(filters.page));
  const qs = query.toString();
  return qs ? `${path}?${qs}` : path;
}

/** Minuscules, sans accents : « Hawaï » et « hawai » se correspondent. */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export type FacetOption = { value: string; label: string; count: number };

export type CatalogSearchResult = {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
  facets: {
    categories: FacetOption[];
    brands: FacetOption[];
    packs: FacetOption[];
    inStock: number;
  };
};

type Context = { brands: Brand[]; categories: Category[] };
type FilterKey = "q" | "category" | "brands" | "packs" | "inStockOnly";

function matches(
  product: Product,
  filters: CatalogFilters,
  context: Context,
  ignore?: FilterKey,
): boolean {
  if (
    ignore !== "category" &&
    filters.category &&
    product.categorySlug !== filters.category
  ) {
    return false;
  }
  if (
    ignore !== "brands" &&
    filters.brands.length > 0 &&
    !filters.brands.includes(product.brandSlug)
  ) {
    return false;
  }
  if (
    ignore !== "packs" &&
    filters.packs.length > 0 &&
    (product.unitsPerPack === null ||
      !filters.packs.includes(product.unitsPerPack))
  ) {
    return false;
  }
  // Stock non renseigné (null) : le produit n'est pas compté comme « en stock ».
  if (
    ignore !== "inStockOnly" &&
    filters.inStockOnly &&
    product.inStock !== true
  )
    return false;
  if (ignore !== "q" && filters.q) {
    const brand =
      context.brands.find((b) => b.slug === product.brandSlug)?.name ?? "";
    const category =
      context.categories.find((c) => c.slug === product.categorySlug)?.name ??
      "";
    const haystack = normalizeText(`${product.name} ${brand} ${category}`);
    const terms = normalizeText(filters.q).split(/\s+/).filter(Boolean);
    if (!terms.every((term) => haystack.includes(term))) return false;
  }
  return true;
}

function compare(sort: SortKey, order: Map<string, number>) {
  const byName = (a: Product, b: Product) => a.name.localeCompare(b.name, "fr");
  return (a: Product, b: Product): number => {
    switch (sort) {
      case "nom":
        return byName(a, b);
      case "prix": {
        // Produits sans prix (« sur devis ») en fin de liste.
        const pa = a.priceFromHtCents ?? Number.POSITIVE_INFINITY;
        const pb = b.priceFromHtCents ?? Number.POSITIVE_INFINITY;
        return pa === pb ? byName(a, b) : pa - pb;
      }
      case "nouveautes":
        return b.createdAt.localeCompare(a.createdAt) || byName(a, b);
      case "populaires":
        return (
          b.popularity - a.popularity ||
          (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
        );
    }
  };
}

/** Compte, pour chaque valeur, les produits qui respectent tous les autres filtres. */
function countBy(
  products: Product[],
  filters: CatalogFilters,
  context: Context,
  ignore: FilterKey,
  key: (p: Product) => string | null,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const product of products) {
    if (!matches(product, filters, context, ignore)) continue;
    const value = key(product);
    if (value !== null) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

export function searchProducts(
  products: Product[],
  filters: CatalogFilters,
  context: Context,
  pageSize = PAGE_SIZE,
): CatalogSearchResult {
  const order = new Map(products.map((p, i) => [p.id, i]));
  const filtered = products
    .filter((p) => matches(p, filters, context))
    .sort(compare(filters.sort, order));

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(filters.page, totalPages);
  const items = filtered.slice((page - 1) * pageSize, page * pageSize);

  const categoryCounts = countBy(
    products,
    filters,
    context,
    "category",
    (p) => p.categorySlug,
  );
  const brandCounts = countBy(
    products,
    filters,
    context,
    "brands",
    (p) => p.brandSlug,
  );
  const packCounts = countBy(products, filters, context, "packs", (p) =>
    p.unitsPerPack === null ? null : String(p.unitsPerPack),
  );
  const inStock = products.filter(
    (p) => p.inStock === true && matches(p, filters, context, "inStockOnly"),
  ).length;

  return {
    items,
    total,
    page,
    totalPages,
    facets: {
      categories: [...context.categories]
        .sort((a, b) => a.sort - b.sort)
        .map((c) => ({
          value: c.slug,
          label: c.name,
          count: categoryCounts.get(c.slug) ?? 0,
        })),
      // Une marque sans produit n'apparaît que si elle est déjà sélectionnée.
      brands: [...context.brands]
        .sort((a, b) => a.name.localeCompare(b.name, "fr"))
        .map((b) => ({
          value: b.slug,
          label: b.name,
          count: brandCounts.get(b.slug) ?? 0,
        }))
        .filter((o) => o.count > 0 || filters.brands.includes(o.value)),
      packs: [...new Set([...packCounts.keys(), ...filters.packs.map(String)])]
        .sort((a, b) => Number(a) - Number(b))
        .map((value) => ({
          value,
          label: `Pack de ${value}`,
          count: packCounts.get(value) ?? 0,
        })),
      inStock,
    },
  };
}
