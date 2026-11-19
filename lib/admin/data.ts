import "server-only";
import type { Tables } from "@/types/database";
import { requireAdmin } from "./auth";
import type { RequestStatus } from "./schemas";

/**
 * Lectures de l'admin, avec la session de l'administrateur (la RLS lui donne
 * accès à tout, y compris aux produits masqués et aux brouillons). Chaque
 * fonction vérifie elle-même les droits.
 */

export const ADMIN_PAGE_SIZE = 50;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (value: unknown): value is string =>
  typeof value === "string" && UUID.test(value);

/** Texte de recherche sans caractères interprétés par l'API (virgules, %…). */
function searchTerm(value: string): string {
  return value
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

function pageRange(page: number): [number, number] {
  const from = (Math.max(1, page) - 1) * ADMIN_PAGE_SIZE;
  return [from, from + ADMIN_PAGE_SIZE - 1];
}

function totalPages(count: number | null): number {
  return Math.max(1, Math.ceil((count ?? 0) / ADMIN_PAGE_SIZE));
}

// ---------------------------------------------------------------------------
// Tableau de bord
// ---------------------------------------------------------------------------

export async function getDashboard() {
  const { supabase } = await requireAdmin();
  const count = { count: "exact", head: true } as const;
  const [products, hidden, newRequests, articles, latest] = await Promise.all([
    supabase.from("products").select("id", count),
    supabase.from("products").select("id", count).eq("published", false),
    supabase.from("requests").select("id", count).eq("status", "nouveau"),
    supabase.from("articles").select("id", count).eq("published", true),
    supabase
      .from("requests")
      .select("id, reference, type, status, company_name, received_at")
      .neq("status", "archive")
      .order("received_at", { ascending: false })
      .limit(5),
  ]);
  return {
    products: products.count ?? 0,
    hiddenProducts: hidden.count ?? 0,
    newRequests: newRequests.count ?? 0,
    publishedArticles: articles.count ?? 0,
    latestRequests: latest.data ?? [],
  };
}

// ---------------------------------------------------------------------------
// Catalogue
// ---------------------------------------------------------------------------

export type CategoryOption = Pick<
  Tables<"categories">,
  "id" | "name" | "parent_id" | "sort"
>;

/** Univers suivis de leurs catégories, pour les listes de choix. */
export async function listCategoryOptions(): Promise<CategoryOption[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, parent_id, sort")
    .order("sort")
    .order("name");
  if (error) throw error;
  return data;
}

export async function listBrandOptions() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("brands")
    .select("id, name")
    .order("name");
  if (error) throw error;
  return data;
}

export type ProductFilters = {
  q: string;
  categoryId: string | null;
  visibility: "toutes" | "visibles" | "masques";
  page: number;
};

export async function listAdminProducts(filters: ProductFilters) {
  const { supabase } = await requireAdmin();
  let query = supabase
    .from("products")
    .select(
      "id, slug, name, images, pack_label, volume, published, in_stock, featured, brand:brands(name), category:categories(name)",
      { count: "exact" },
    );

  const q = searchTerm(filters.q);
  if (q) query = query.or(`name.ilike.%${q}%,sku.ilike.%${q}%`);
  if (filters.visibility === "visibles") query = query.eq("published", true);
  if (filters.visibility === "masques") query = query.eq("published", false);
  if (filters.categoryId) {
    // Un univers inclut ses catégories.
    const { data: children } = await supabase
      .from("categories")
      .select("id")
      .eq("parent_id", filters.categoryId);
    query = query.in("category_id", [
      filters.categoryId,
      ...(children ?? []).map((c) => c.id),
    ]);
  }

  const { data, count, error } = await query
    .order("name")
    .range(...pageRange(filters.page));
  if (error) throw error;
  return { items: data, total: count ?? 0, totalPages: totalPages(count) };
}

export async function getAdminProduct(id: string) {
  if (!isUuid(id)) return null;
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listAdminCategories() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, description, parent_id, sort, products(count)")
    .order("sort")
    .order("name");
  if (error) throw error;
  return data.map(({ products, ...category }) => ({
    ...category,
    productCount: products[0]?.count ?? 0,
  }));
}

export async function getAdminCategory(id: string) {
  if (!isUuid(id)) return null;
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listAdminBrands() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("brands")
    .select("id, slug, name, products(count)")
    .order("name");
  if (error) throw error;
  return data.map(({ products, ...brand }) => ({
    ...brand,
    productCount: products[0]?.count ?? 0,
  }));
}

export async function getAdminBrand(id: string) {
  if (!isUuid(id)) return null;
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Actualités
// ---------------------------------------------------------------------------

export async function listAdminArticles() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, published, published_at, updated_at, cover_url")
    .order("published", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: true })
    .order("updated_at", { ascending: false })
    .range(0, 499);
  if (error) throw error;
  return data;
}

export async function getAdminArticle(id: string) {
  if (!isUuid(id)) return null;
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Demandes reçues
// ---------------------------------------------------------------------------

/** « a-traiter » = nouvelles et en cours (vue par défaut). */
export type RequestFilter = RequestStatus | "a-traiter" | "toutes";

export async function listAdminRequests(filter: RequestFilter, page: number) {
  const { supabase } = await requireAdmin();
  let query = supabase
    .from("requests")
    .select(
      "id, reference, type, status, company_name, contact_name, received_at",
      { count: "exact" },
    );
  if (filter === "a-traiter")
    query = query.in("status", ["nouveau", "en_cours"]);
  else if (filter !== "toutes") query = query.eq("status", filter);

  const { data, count, error } = await query
    .order("received_at", { ascending: false })
    .range(...pageRange(page));
  if (error) throw error;
  return { items: data, total: count ?? 0, totalPages: totalPages(count) };
}

export async function getAdminRequest(id: string) {
  if (!isUuid(id)) return null;
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
