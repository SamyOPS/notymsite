import { slugify } from "../admin/slug";
import { parseLabel } from "./label";
import { ALCOHOL_UNIVERSE, categoryForFamily, taxonomy } from "./taxonomy";

/**
 * Export produits du logiciel de gestion (CSV) → produits du site.
 * Colonnes lues : Référence, Description, Famille du produit,
 * Standard Prix U. (HT). Le prix de revient n'est jamais lu.
 */

export type ErpRow = {
  reference: string;
  label: string;
  family: string;
  /** Prix de vente HT en centimes ; null si absent ou nul. */
  priceCents: number | null;
};

export type ImportProduct = {
  sku: string;
  sourceLabel: string;
  name: string;
  slug: string;
  brand: string | null;
  categorySlug: string;
  volume: string | null;
  unitsPerPack: number | null;
  packLabel: string;
  priceCents: number | null;
  warnings: string[];
};

export type ImportPlan = {
  products: ImportProduct[];
  /** Lignes écartées, avec la raison. */
  skipped: Array<{ reference: string; label: string; reason: string }>;
  /** Références présentes plusieurs fois dans l'export. */
  duplicates: string[];
};

/** Lignes de l'export qui ne sont pas des produits à mettre en ligne. */
const NOT_PRODUCTS: Array<[RegExp, string]> = [
  [/^TRANSPORT$/i, "frais de transport"],
  [/^PALETTE\b/i, "palette"],
  [/^CONSIGNE\b/i, "consigne"],
  [/DATE COURTE/i, "lot de déstockage"],
];

// ---------------------------------------------------------------------------
// Lecture du CSV (séparateur virgule, guillemets possibles)
// ---------------------------------------------------------------------------

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const content = text.replace(/^﻿/, "");
  for (let i = 0; i < content.length; i++) {
    const c = content[i]!;
    if (quoted) {
      if (c === '"' && content[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && content[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  row.push(field);
  if (row.some((v) => v.trim() !== "")) rows.push(row);
  return rows;
}

const HEADERS = {
  reference: "Référence",
  label: "Description",
  family: "Famille du produit",
  price: "Standard Prix U. (HT)",
} as const;

export function readErpRows(text: string): ErpRow[] {
  const [header, ...lines] = parseCsv(text);
  if (!header) throw new Error("Fichier vide.");
  const index = (name: string) => {
    const i = header.findIndex((h) => h.trim() === name);
    if (i === -1) throw new Error(`Colonne « ${name} » introuvable.`);
    return i;
  };
  const col = {
    reference: index(HEADERS.reference),
    label: index(HEADERS.label),
    family: index(HEADERS.family),
    price: index(HEADERS.price),
  };
  return lines.map((cells) => {
    const price = Number((cells[col.price] ?? "").replace(",", "."));
    return {
      reference: (cells[col.reference] ?? "").trim(),
      label: (cells[col.label] ?? "").trim(),
      family: (cells[col.family] ?? "").trim(),
      priceCents:
        Number.isFinite(price) && price > 0 ? Math.round(price * 100) : null,
    };
  });
}

// ---------------------------------------------------------------------------

const universeOf = new Map<string, string>();
for (const universe of taxonomy) {
  universeOf.set(universe.slug, universe.slug);
  for (const category of universe.categories) {
    universeOf.set(category.slug, universe.slug);
  }
}

export function buildImportPlan(rows: ErpRow[]): ImportPlan {
  const skipped: ImportPlan["skipped"] = [];

  // Une référence en double : on garde la première ligne, au plus petit prix
  // (le prix importé est un prix « à partir de »).
  const byRef = new Map<string, ErpRow>();
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (!row.reference || !row.label) {
      skipped.push({
        reference: row.reference,
        label: row.label,
        reason: "ligne incomplète",
      });
      continue;
    }
    counts.set(row.reference, (counts.get(row.reference) ?? 0) + 1);
    const existing = byRef.get(row.reference);
    if (!existing) {
      byRef.set(row.reference, { ...row });
    } else if (
      row.priceCents !== null &&
      (existing.priceCents === null || row.priceCents < existing.priceCents)
    ) {
      existing.priceCents = row.priceCents;
    }
  }
  const duplicates = [...counts].filter(([, n]) => n > 1).map(([ref]) => ref);

  const products: ImportProduct[] = [];
  const slugs = new Set<string>();
  for (const row of byRef.values()) {
    const notProduct = NOT_PRODUCTS.find(([re]) => re.test(row.label));
    if (notProduct) {
      skipped.push({
        reference: row.reference,
        label: row.label,
        reason: notProduct[1],
      });
      continue;
    }
    const categorySlug = categoryForFamily(row.family, row.label);
    if (!categorySlug) {
      skipped.push({
        reference: row.reference,
        label: row.label,
        reason: `famille inconnue « ${row.family} »`,
      });
      continue;
    }
    const universe = universeOf.get(categorySlug);
    const isAlcohol = universe === ALCOHOL_UNIVERSE;
    const parsed = parseLabel(row.label, {
      isBeverage: universe === "boissons" || isAlcohol,
      isAlcohol,
      isFood:
        universe === "epicerie-salee" ||
        universe === "epicerie-sucree" ||
        universe === "produits-exotiques",
    });

    // Adresse : nom + nombre d'unités (« coca-cola-33-cl-x24 »), unique.
    const base = slugify(
      parsed.unitsPerPack && parsed.unitsPerPack > 1
        ? `${parsed.name} x${parsed.unitsPerPack}`
        : parsed.name,
      90,
    );
    let slug = base || slugify(row.reference);
    if (slugs.has(slug)) slug = `${base}-${slugify(row.reference)}`;
    slugs.add(slug);

    products.push({
      sku: row.reference,
      sourceLabel: row.label,
      name: parsed.name,
      slug,
      brand: parsed.brand,
      categorySlug,
      volume: parsed.volume,
      unitsPerPack: parsed.unitsPerPack,
      packLabel: parsed.packLabel,
      priceCents: row.priceCents,
      warnings: parsed.warnings,
    });
  }

  return { products, skipped, duplicates };
}

/** Fichier de contrôle (CSV point-virgule, lisible dans Excel). */
export function reviewCsv(plan: ImportPlan): string {
  const names = new Map<string, { universe: string; category: string }>();
  for (const universe of taxonomy) {
    names.set(universe.slug, { universe: universe.name, category: "" });
    for (const category of universe.categories) {
      names.set(category.slug, {
        universe: universe.name,
        category: category.name,
      });
    }
  }
  const cell = (value: unknown) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[;"\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const header = [
    "Référence",
    "Libellé de l'export",
    "Nom sur le site",
    "Marque",
    "Univers",
    "Catégorie",
    "Contenance",
    "Unités",
    "Conditionnement",
    "Prix HT",
    "À vérifier",
  ];
  const lines = plan.products.map((p) => {
    const place = names.get(p.categorySlug);
    return [
      p.sku,
      p.sourceLabel,
      p.name,
      p.brand,
      place?.universe,
      place?.category,
      p.volume,
      p.unitsPerPack,
      p.packLabel,
      p.priceCents === null
        ? ""
        : (p.priceCents / 100).toFixed(2).replace(".", ","),
      p.warnings.join(", "),
    ]
      .map(cell)
      .join(";");
  });
  return "﻿" + [header.join(";"), ...lines].join("\r\n") + "\r\n";
}
