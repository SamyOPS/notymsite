import type { Tables } from "@/types/database";
import type { FormValues } from "./forms";

/** Valeurs enregistrées → valeurs des champs de formulaire (texte). */

const on = (value: boolean) => (value ? "on" : "");

/** 1290 → « 12,90 » */
export function centsToEuros(cents: number | null): string {
  return cents === null ? "" : (cents / 100).toFixed(2).replace(".", ",");
}

export function productFormValues(p?: Tables<"products"> | null): FormValues {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    brandId: p?.brand_id ?? "",
    categoryId: p?.category_id ?? "",
    volume: p?.volume ?? "",
    unitsPerPack: p?.units_per_pack?.toString() ?? "",
    packLabel: p?.pack_label ?? "",
    sku: p?.sku ?? "",
    description: p?.description ?? "",
    images: p?.images ?? [],
    stock:
      p?.in_stock === true
        ? "en-stock"
        : p?.in_stock === false
          ? "rupture"
          : "",
    price: centsToEuros(p?.price_from_ht_cents ?? null),
    popularity: String(p?.popularity ?? 0),
    isBestSeller: on(p?.is_best_seller ?? false),
    isNew: on(p?.is_new ?? false),
    isPromo: on(p?.is_promo ?? false),
    featured: on(p?.featured ?? false),
    // Un nouveau produit est visible par défaut.
    published: on(p?.published ?? true),
  };
}

export function categoryFormValues(
  c?: Tables<"categories"> | null,
): FormValues {
  return {
    name: c?.name ?? "",
    slug: c?.slug ?? "",
    description: c?.description ?? "",
    parentId: c?.parent_id ?? "",
    sort: String(c?.sort ?? 0),
  };
}

export function brandFormValues(b?: Tables<"brands"> | null): FormValues {
  return { name: b?.name ?? "", slug: b?.slug ?? "" };
}

export function articleFormValues(a?: Tables<"articles"> | null): FormValues {
  return {
    title: a?.title ?? "",
    slug: a?.slug ?? "",
    excerpt: a?.excerpt ?? "",
    content: a?.content ?? "",
    coverUrl: a?.cover_url ? [a.cover_url] : [],
    coverAlt: a?.cover_alt ?? "",
    published: on(a?.published ?? false),
    publishedOn: a?.published_at ? a.published_at.slice(0, 10) : "",
  };
}
