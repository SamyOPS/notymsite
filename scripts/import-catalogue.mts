/**
 * Import de l'export produits du logiciel de gestion dans Supabase.
 *
 *   npm run import:catalogue -- <export.csv> --dry-run [--out controle.csv]
 *   npm run import:catalogue -- <export.csv> --apply
 *
 * --dry-run : n'écrit rien, produit un fichier de contrôle (Excel).
 * --apply   : crée les catégories, marques et produits manquants, et met à
 *             jour le prix des produits déjà présents (repérés par leur
 *             référence). Les noms, photos, descriptions et réglages modifiés
 *             dans l'admin ne sont jamais écrasés.
 *
 * Utilise SUPABASE_SECRET_KEY (.env.local) : à lancer sur un poste de confiance.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";
import { slugify } from "../lib/admin/slug";
import { buildImportPlan, readErpRows, reviewCsv } from "../lib/import/erp";
import { taxonomy } from "../lib/import/taxonomy";
import type { Database, TablesInsert } from "../types/database";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const apply = args.includes("--apply");
const dryRun = args.includes("--dry-run");
const outIndex = args.indexOf("--out");
const out = outIndex >= 0 ? args[outIndex + 1] : undefined;

if (!file || apply === dryRun) {
  console.error(
    "Usage : npm run import:catalogue -- <export.csv> (--dry-run [--out controle.csv] | --apply)",
  );
  process.exit(1);
}

const plan = buildImportPlan(readErpRows(readFileSync(file, "utf8")));

console.log(`Produits à importer : ${plan.products.length}`);
console.log(`Références en double dans l'export : ${plan.duplicates.length}`);
console.log(`Lignes écartées : ${plan.skipped.length}`);
for (const s of plan.skipped)
  console.log(`  - ${s.reference} ${s.label} (${s.reason})`);
const toCheck = plan.products.filter((p) => p.warnings.length > 0);
console.log(`Lignes à vérifier : ${toCheck.length}`);

if (dryRun) {
  const target = out ?? "controle-import.csv";
  writeFileSync(target, reviewCsv(plan), "utf8");
  console.log(`Fichier de contrôle : ${target}`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

try {
  process.loadEnvFile(".env.local");
} catch {
  // Variables déjà définies dans l'environnement.
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SECRET_KEY sont nécessaires (.env.local).",
  );
  process.exit(1);
}
const supabase = createClient<Database>(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function fetchAll<T>(
  query: (
    from: number,
    to: number,
  ) => PromiseLike<{ data: T[] | null; error: unknown }>,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await query(from, from + 999);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < 1000) return rows;
  }
}

// 1. Univers et catégories : créés s'ils manquent ; l'ordre et le rattachement
//    suivent lib/import/taxonomy.ts. Noms et descriptions restent ceux de l'admin.
const categories = await fetchAll((from, to) =>
  supabase
    .from("categories")
    .select("id, slug, parent_id, sort")
    .range(from, to),
);
const categoryId = new Map(categories.map((c) => [c.slug, c.id]));
let created = 0;
for (const [u, universe] of taxonomy.entries()) {
  const entries = [
    { def: universe, parent: null as string | null, sort: (u + 1) * 100 },
    ...universe.categories.map((def, i) => ({
      def,
      parent: universe.slug,
      sort: (u + 1) * 100 + i + 1,
    })),
  ];
  for (const { def, parent, sort } of entries) {
    const parentId = parent ? categoryId.get(parent)! : null;
    const id = categoryId.get(def.slug);
    if (id) {
      const { error } = await supabase
        .from("categories")
        .update({ parent_id: parentId, sort })
        .eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          slug: def.slug,
          name: def.name,
          description: def.description,
          parent_id: parentId,
          sort,
        })
        .select("id")
        .single();
      if (error) throw error;
      categoryId.set(def.slug, data.id);
      created++;
    }
  }
}
console.log(`Catégories créées : ${created}`);

// 2. Marques
const brands = await fetchAll((from, to) =>
  supabase.from("brands").select("id, slug").range(from, to),
);
const brandId = new Map(brands.map((b) => [b.slug, b.id]));
const newBrands = [
  ...new Map(
    plan.products
      .filter((p) => p.brand)
      .map((p) => [slugify(p.brand!), p.brand!] as const),
  ),
].filter(([slug]) => !brandId.has(slug));
if (newBrands.length > 0) {
  const { data, error } = await supabase
    .from("brands")
    .insert(newBrands.map(([slug, name]) => ({ slug, name })))
    .select("id, slug");
  if (error) throw error;
  for (const b of data) brandId.set(b.slug, b.id);
}
console.log(`Marques créées : ${newBrands.length}`);

// 3. Produits : nouveaux créés, prix mis à jour pour les existants.
const existing = await fetchAll((from, to) =>
  supabase
    .from("products")
    .select("id, sku, slug, price_from_ht_cents")
    .range(from, to),
);
const bySku = new Map(existing.filter((p) => p.sku).map((p) => [p.sku!, p]));
const takenSlugs = new Set(existing.map((p) => p.slug));

const inserts: TablesInsert<"products">[] = [];
let priceUpdates = 0;
for (const p of plan.products) {
  const current = bySku.get(p.sku);
  if (current) {
    if (current.price_from_ht_cents !== p.priceCents) {
      const { error } = await supabase
        .from("products")
        .update({ price_from_ht_cents: p.priceCents })
        .eq("id", current.id);
      if (error) throw error;
      priceUpdates++;
    }
    continue;
  }
  let slug = p.slug;
  if (takenSlugs.has(slug)) slug = `${p.slug}-${slugify(p.sku)}`;
  takenSlugs.add(slug);
  inserts.push({
    sku: p.sku,
    slug,
    name: p.name,
    brand_id: p.brand ? (brandId.get(slugify(p.brand)) ?? null) : null,
    category_id: categoryId.get(p.categorySlug)!,
    volume: p.volume,
    units_per_pack: p.unitsPerPack,
    pack_label: p.packLabel,
    price_from_ht_cents: p.priceCents,
    published: true,
  });
}
for (let i = 0; i < inserts.length; i += 500) {
  const { error } = await supabase
    .from("products")
    .insert(inserts.slice(i, i + 500));
  if (error) throw error;
}
console.log(`Produits créés : ${inserts.length}`);
console.log(`Prix mis à jour : ${priceUpdates}`);

const inExport = new Set(plan.products.map((p) => p.sku));
const absent = existing.filter((p) => p.sku && !inExport.has(p.sku));
if (absent.length > 0) {
  console.log(
    `Produits du site absents de l'export (laissés tels quels) : ${absent.length}`,
  );
  for (const p of absent) console.log(`  - ${p.sku} ${p.slug}`);
}
console.log(
  "\nPensez à rafraîchir le cache du site : un enregistrement dans l'admin suffit, sinon il se met à jour sous 15 minutes.",
);
