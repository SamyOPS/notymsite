export type ProductBadge = "best-seller" | "promo" | "new";

export type CategoryTone = "teal" | "ink" | "wheat" | "teal-soft";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  tone: CategoryTone;
  sort: number;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
};

export type Product = {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  brandSlug: string;
  categorySlug: string;
  /** Contenance unitaire : « 33 cl », « 1,5 L » */
  volume: string | null;
  /** Nombre d'unités par pack ; null si non confirmé */
  unitsPerPack: number | null;
  /** Conditionnement affiché : « Pack de 24 » */
  packLabel: string;
  description: string | null;
  images: string[];
  isBestSeller: boolean;
  isNew: boolean;
  isPromo: boolean;
  inStock: boolean;
  /** Mis en avant sur l'accueil (« produits phares ») */
  featured: boolean;
  popularity: number;
  /** Prix « à partir de » HT en centimes ; null = « Prix sur devis » */
  priceFromHtCents: number | null;
  /** Identifiant sur l'ancien site (/product/1), pour les redirections 301 */
  legacyId: number | null;
  createdAt: string;
};

/** Données nécessaires à l'affichage d'une carte produit. */
export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  /** Conditionnement, toujours affiché : « Pack de 24 » */
  packLabel: string;
  /** Contenance unitaire : « 33 cl », « 1,5 L » */
  volume: string | null;
  imageUrl: string | null;
  badges: ProductBadge[];
  inStock: boolean;
  /** Prix « à partir de » HT en centimes ; null = « Prix sur devis » */
  priceFromHtCents: number | null;
};

/** Produit tel qu'affiché dans la demande de devis. */
export type QuoteProduct = ProductCardData & { unitsPerPack: number | null };
