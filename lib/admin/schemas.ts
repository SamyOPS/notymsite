import { z } from "zod";
import type { TablesInsert } from "@/types/database";
import { isAllowedImageUrl } from "./media";
import { SLUG_PATTERN, slugify } from "./slug";

/**
 * Validation des formulaires de l'admin. Les valeurs arrivent en texte
 * (FormData) ; chaque schéma renvoie la ligne prête à enregistrer.
 */

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `${max.toLocaleString("fr-FR")} caractères maximum.` });

const required = (label: string, max: number) =>
  text(max).min(1, { error: `Indiquez ${label}.` });

/** Champ facultatif : texte vide → null. */
const nullable = (max: number) => text(max).transform((v) => v || null);

const slug = (max: number) =>
  z
    .string()
    .trim()
    .toLowerCase()
    .max(max, { error: `${max} caractères maximum.` })
    .refine((v) => v === "" || SLUG_PATTERN.test(v), {
      error:
        "Minuscules, chiffres et tirets uniquement, par exemple coca-cola-33-cl.",
    });

/** Case à cocher : « on » si cochée, absente sinon. */
const checkbox = z
  .string()
  .optional()
  .transform((v) => v === "on");

const id = (message: string) => z.uuid({ error: message });

const optionalId = z
  .string()
  .trim()
  .transform((v) => v || null)
  .pipe(z.uuid({ error: "Choix invalide." }).nullable());

/** Nombre entier facultatif : texte vide → null. */
const optionalInt = (min: number, max: number, message: string) =>
  z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : Number(v)))
    .refine(
      (n) => n === null || (Number.isInteger(n) && n >= min && n <= max),
      { error: message },
    );

/** « 12,90 » ou « 12.90 » (euros) → 1290 (centimes) ; vide → null. */
export function parseEuros(value: string): number | null | undefined {
  const v = value.trim().replace(/\s|€/g, "").replace(",", ".");
  if (v === "") return null;
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(v)) return undefined;
  return Math.round(Number(v) * 100);
}

const images = z
  .array(z.string())
  .max(8, { error: "8 photos maximum." })
  .refine((urls) => urls.every(isAllowedImageUrl), {
    error:
      "Une photo n'a pas pu être vérifiée. Retirez-la et ajoutez-la de nouveau.",
  });

// ---------------------------------------------------------------------------
// Produits
// ---------------------------------------------------------------------------

export const stockOptions = [
  { value: "", label: "Non renseignée (rien n'est affiché)" },
  { value: "en-stock", label: "En stock" },
  { value: "rupture", label: "En rupture" },
] as const;

export const productSchema = z
  .object({
    name: required("le nom du produit", 150),
    slug: slug(100),
    brandId: optionalId,
    categoryId: id("Choisissez une catégorie."),
    volume: nullable(30),
    unitsPerPack: optionalInt(1, 9999, "Un nombre entier entre 1 et 9 999."),
    packLabel: text(60),
    sku: nullable(50),
    description: nullable(5000),
    images,
    stock: z.enum(["", "en-stock", "rupture"], { error: "Choix invalide." }),
    price: z.string().refine((v) => parseEuros(v) !== undefined, {
      error: "Montant en euros, par exemple 12,90.",
    }),
    popularity: z
      .string()
      .trim()
      .transform((v) => (v === "" ? 0 : Number(v)))
      .refine((n) => Number.isInteger(n) && Math.abs(n) <= 1_000_000, {
        error: "Un nombre entier.",
      }),
    isBestSeller: checkbox,
    isNew: checkbox,
    isPromo: checkbox,
    featured: checkbox,
    published: checkbox,
  })
  .superRefine((v, ctx) => {
    if (!v.packLabel && v.unitsPerPack === null) {
      ctx.addIssue({
        code: "custom",
        path: ["packLabel"],
        message: "Indiquez le conditionnement ou le nombre d'unités par pack.",
      });
    }
    if (!v.slug && !slugify(v.name)) {
      ctx.addIssue({
        code: "custom",
        path: ["slug"],
        message: "Indiquez l'adresse de la page.",
      });
    }
  })
  .transform((v): TablesInsert<"products"> => ({
    name: v.name,
    slug: v.slug || slugify(v.name, 100),
    brand_id: v.brandId,
    category_id: v.categoryId,
    volume: v.volume,
    units_per_pack: v.unitsPerPack,
    pack_label: v.packLabel || `Pack de ${v.unitsPerPack}`,
    sku: v.sku,
    description: v.description,
    images: [...new Set(v.images)],
    in_stock:
      v.stock === "en-stock" ? true : v.stock === "rupture" ? false : null,
    price_from_ht_cents: parseEuros(v.price) ?? null,
    popularity: v.popularity,
    is_best_seller: v.isBestSeller,
    is_new: v.isNew,
    is_promo: v.isPromo,
    featured: v.featured,
    published: v.published,
  }));

// ---------------------------------------------------------------------------
// Catégories et marques
// ---------------------------------------------------------------------------

export const categorySchema = z
  .object({
    name: required("le nom", 100),
    slug: slug(60),
    description: text(300),
    parentId: optionalId,
    sort: z
      .string()
      .trim()
      .transform((v) => (v === "" ? 0 : Number(v)))
      .refine((n) => Number.isInteger(n) && Math.abs(n) <= 10_000, {
        error: "Un nombre entier.",
      }),
  })
  .transform((v): TablesInsert<"categories"> => ({
    name: v.name,
    slug: v.slug || slugify(v.name),
    description: v.description,
    parent_id: v.parentId,
    sort: v.sort,
  }))
  .refine((v) => v.slug !== "", {
    path: ["slug"],
    error: "Indiquez l'adresse de la page.",
  });

export const brandSchema = z
  .object({ name: required("le nom", 100), slug: slug(60) })
  .transform((v): TablesInsert<"brands"> => ({
    name: v.name,
    slug: v.slug || slugify(v.name),
  }))
  .refine((v) => v.slug !== "", {
    path: ["slug"],
    error: "Indiquez un identifiant.",
  });

// ---------------------------------------------------------------------------
// Actualités
// ---------------------------------------------------------------------------

export const articleSchema = z
  .object({
    title: required("le titre", 150),
    slug: slug(100),
    excerpt: text(300),
    content: text(50_000),
    coverUrl: z
      .array(z.string())
      .max(1)
      .refine((urls) => urls.every(isAllowedImageUrl), {
        error: "La photo n'a pas pu être vérifiée. Ajoutez-la de nouveau.",
      }),
    coverAlt: text(200),
    published: checkbox,
    /** AAAA-MM-JJ ; vide = date du jour à la publication. */
    publishedOn: z
      .string()
      .trim()
      .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), {
        error: "Date invalide.",
      }),
  })
  .superRefine((v, ctx) => {
    if (v.coverUrl.length > 0 && !v.coverAlt) {
      ctx.addIssue({
        code: "custom",
        path: ["coverAlt"],
        message:
          "Décrivez la photo en quelques mots (lu par les lecteurs d'écran).",
      });
    }
    if (v.published && !v.content) {
      ctx.addIssue({
        code: "custom",
        path: ["content"],
        message: "Rédigez le texte avant de publier.",
      });
    }
  })
  .transform((v) => ({
    title: v.title,
    slug: v.slug || slugify(v.title, 100),
    excerpt: v.excerpt,
    content: v.content,
    cover_url: v.coverUrl[0] ?? null,
    cover_alt: v.coverUrl.length > 0 ? v.coverAlt : "",
    published: v.published,
    // Midi UTC : la date reste la même quel que soit le fuseau d'affichage.
    publishedOn: v.publishedOn ? `${v.publishedOn}T12:00:00Z` : null,
  }))
  .refine((v) => v.slug !== "", {
    path: ["slug"],
    error: "Indiquez l'adresse de la page.",
  });

// ---------------------------------------------------------------------------
// Demandes reçues
// ---------------------------------------------------------------------------

export const requestStatuses = [
  { value: "nouveau", label: "Nouvelle" },
  { value: "en_cours", label: "En cours" },
  { value: "traite", label: "Traitée" },
  { value: "archive", label: "Archivée" },
] as const;

export type RequestStatus = (typeof requestStatuses)[number]["value"];

export const requestUpdateSchema = z.object({
  status: z.enum(
    requestStatuses.map((s) => s.value) as [RequestStatus, ...RequestStatus[]],
    { error: "Choisissez un statut." },
  ),
  notes: text(5000),
});
