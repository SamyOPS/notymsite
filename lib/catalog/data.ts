import type { Brand, Category, Product } from "@/types/catalog";

/**
 * Catalogue local, en attendant la base Supabase.
 *
 * - Produits repris de la page d'accueil de notym.fr (04/11/2026).
 * - AUCUN PRIX : priceFromHtCents = null partout. Les prix sont d'ailleurs
 *   masqués sur le site (site.features.showPrices = false).
 * - AUCUN STOCK : inStock = null partout (non renseigné, rien n'est affiché).
 * - À CONFIRMER : type de contenant (canette, bouteille, poche…), catégorie
 *   de chaque produit, format de Perrier, descriptions et photos.
 */

/**
 * Trois univers (niveau 1) et leurs catégories (niveau 2). Un produit est
 * rattaché à une catégorie ; la page d'un univers regroupe ses catégories.
 */
export const categories: Category[] = [
  {
    id: "cat-boissons",
    slug: "boissons",
    name: "Boissons",
    description: "Sodas, eaux, énergisants, jus et nectars",
    parentSlug: null,
    sort: 1,
  },
  {
    id: "cat-sodas-eaux",
    slug: "sodas-eaux",
    name: "Sodas & Eaux",
    description: "Coca-Cola, Pepsi, Evian, Badoit",
    parentSlug: "boissons",
    sort: 2,
  },
  {
    id: "cat-energisants",
    slug: "energisants",
    name: "Énergisants",
    description: "Red Bull, Monster",
    parentSlug: "boissons",
    sort: 3,
  },
  {
    id: "cat-jus-nectars",
    slug: "jus-nectars",
    name: "Jus & Nectars",
    description: "Tropicana, Oasis, Innocent",
    parentSlug: "boissons",
    sort: 4,
  },
  {
    // Aucun produit pour l'instant : la page l'indique.
    id: "cat-epicerie-sucree",
    slug: "epicerie-sucree",
    name: "Épicerie sucrée",
    description: "Produits sucrés pour les commerces et la restauration",
    parentSlug: null,
    sort: 5,
  },
  {
    id: "cat-epicerie-salee",
    slug: "epicerie-salee",
    name: "Épicerie salée",
    description: "Chips, snacks et produits salés",
    parentSlug: null,
    sort: 6,
  },
  {
    id: "cat-chips-snacks",
    slug: "chips-snacks",
    name: "Chips & Snacks",
    description: "Lay's, Brets",
    parentSlug: "epicerie-salee",
    sort: 7,
  },
];

const brand = (slug: string, name: string): Brand => ({
  id: `brand-${slug}`,
  slug,
  name,
  logoUrl: null,
});

export const brands: Brand[] = [
  brand("coca-cola", "Coca-Cola"),
  brand("pepsi", "Pepsi"),
  brand("orangina", "Orangina"),
  brand("oasis", "Oasis"),
  brand("lipton", "Lipton"),
  brand("cristaline", "Cristaline"),
  brand("mogu-mogu", "Mogu Mogu"),
  brand("powerade", "Powerade"),
  brand("red-bull", "Red Bull"),
  brand("blue", "B'lue"),
  brand("hawai", "Hawaï"),
  brand("capri-sun", "Capri-Sun"),
  brand("minute-maid", "Minute Maid"),
  brand("perrier", "Perrier"),
];

type ProductSeed = Pick<
  Product,
  | "slug"
  | "name"
  | "brandSlug"
  | "categorySlug"
  | "volume"
  | "unitsPerPack"
  | "packLabel"
  | "legacyId"
>;

const seeds: ProductSeed[] = [
  {
    slug: "coca-cola-1-5-l-x24",
    name: "Coca-Cola 1,5 L",
    brandSlug: "coca-cola",
    categorySlug: "sodas-eaux",
    volume: "1,5 L",
    unitsPerPack: 24,
    packLabel: "Pack de 24",
    legacyId: 1,
  },
  {
    slug: "blue-33-cl-x24",
    name: "B'lue 33 cl",
    brandSlug: "blue",
    categorySlug: "sodas-eaux",
    volume: "33 cl",
    unitsPerPack: 24,
    packLabel: "Pack de 24",
    legacyId: 2,
  },
  {
    slug: "lipton-ice-tea-33-cl-x12",
    name: "Lipton Ice Tea 33 cl",
    brandSlug: "lipton",
    categorySlug: "sodas-eaux",
    volume: "33 cl",
    unitsPerPack: 12,
    packLabel: "Pack de 12",
    legacyId: 3,
  },
  {
    slug: "hawai-33-cl-x24",
    name: "Hawaï 33 cl",
    brandSlug: "hawai",
    categorySlug: "sodas-eaux",
    volume: "33 cl",
    unitsPerPack: 24,
    packLabel: "Pack de 24",
    legacyId: 4,
  },
  {
    slug: "capri-sun-20-cl-x10",
    name: "Capri-Sun 20 cl",
    brandSlug: "capri-sun",
    categorySlug: "jus-nectars",
    volume: "20 cl",
    unitsPerPack: 10,
    packLabel: "Pack de 10",
    legacyId: 5,
  },
  {
    slug: "red-bull-25-cl-x24",
    name: "Red Bull 25 cl",
    brandSlug: "red-bull",
    categorySlug: "energisants",
    volume: "25 cl",
    unitsPerPack: 24,
    packLabel: "Pack de 24",
    legacyId: 6,
  },
  {
    slug: "minute-maid-orange-33-cl-x24",
    name: "Minute Maid Orange 33 cl",
    brandSlug: "minute-maid",
    categorySlug: "jus-nectars",
    volume: "33 cl",
    unitsPerPack: 24,
    packLabel: "Pack de 24",
    legacyId: 7,
  },
  {
    // Format affiché « 35x25 » sur l'ancien site : à confirmer.
    slug: "perrier",
    name: "Perrier",
    brandSlug: "perrier",
    categorySlug: "sodas-eaux",
    volume: null,
    unitsPerPack: null,
    packLabel: "Conditionnement à confirmer",
    legacyId: 8,
  },
];

/**
 * Photos disponibles (Open Food Facts, CC BY-SA 3.0, voir lib/image-credits.ts).
 * B'lue n'a pas de photo fiable : le site affiche « Visuel à venir ».
 */
const productImages: Record<string, string> = {
  "coca-cola-1-5-l-x24": "/products/coca-cola-1-5-l-x24.webp",
  "lipton-ice-tea-33-cl-x12": "/products/lipton-ice-tea-33-cl-x12.webp",
  "hawai-33-cl-x24": "/products/hawai-33-cl-x24.webp",
  "capri-sun-20-cl-x10": "/products/capri-sun-20-cl-x10.webp",
  "red-bull-25-cl-x24": "/products/red-bull-25-cl-x24.webp",
  "minute-maid-orange-33-cl-x24": "/products/minute-maid-orange-33-cl-x24.webp",
  perrier: "/products/perrier.webp",
};

export const products: Product[] = seeds.map((seed, index) => ({
  ...seed,
  id: `prod-${seed.legacyId ?? index + 1}`,
  sku: null,
  description: null,
  images: [productImages[seed.slug]].filter((src): src is string =>
    Boolean(src),
  ),
  isBestSeller: false,
  isNew: false,
  isPromo: false,
  inStock: null,
  featured: true,
  popularity: 0,
  priceFromHtCents: null,
  createdAt: "2026-11-04T00:00:00.000Z",
}));
