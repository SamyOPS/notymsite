export type ProductBadge = "best-seller" | "promo" | "new";

/** Données nécessaires à l'affichage d'une carte produit. */
export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  /** Conditionnement, toujours affiché : « Pack de 24 canettes » */
  packLabel: string;
  /** Contenance unitaire : « 33 cl », « 1,5 L » */
  volume: string | null;
  imageUrl: string | null;
  badges: ProductBadge[];
  inStock: boolean;
  /** Prix « à partir de » HT en centimes ; null = « Prix sur devis » */
  priceFromHtCents: number | null;
};

export type CategoryTone = "teal" | "ink" | "wheat" | "teal-soft";
