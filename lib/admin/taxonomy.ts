import "server-only";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { CATALOG_TAG } from "@/lib/catalog/queries";
import { firstErrors } from "@/lib/validation/fields";
import { requireAdmin, type AdminSession } from "./auth";
import {
  dbErrorMessage,
  isInUseError,
  readForm,
  type AdminFormState,
  type FormValues,
} from "./forms";
import { brandSchema, categorySchema } from "./schemas";

/**
 * Enregistrement et suppression des catégories et des marques : mêmes règles
 * (nom + adresse unique), même fonctionnement. Appelés par les actions de
 * /admin/categories et /admin/marques.
 */

const entities = {
  categories: {
    list: "/admin/categories",
    slugTaken: "Cette adresse est déjà utilisée par une autre catégorie.",
    inUse:
      "Impossible de supprimer : des produits ou des catégories y sont rattachés. Déplacez-les d'abord.",
  },
  brands: {
    list: "/admin/marques",
    slugTaken: "Cet identifiant est déjà utilisé par une autre marque.",
    inUse:
      "Impossible de supprimer : des produits sont rattachés à cette marque. Modifiez-les d'abord.",
  },
} as const;

type Entity = keyof typeof entities;
type DbResult = { error: { code?: string; message?: string } | null };

function invalid(error: z.ZodError, values: FormValues): AdminFormState {
  return {
    status: "error",
    message: "Certains champs sont à corriger.",
    errors: firstErrors(error),
    values,
  };
}

async function write(
  supabase: AdminSession["supabase"],
  entity: Entity,
  id: string | null,
  values: FormValues,
): Promise<AdminFormState | DbResult> {
  if (entity === "categories") {
    const parsed = categorySchema.safeParse(values);
    if (!parsed.success) return invalid(parsed.error, values);
    if (id && parsed.data.parent_id === id) {
      return {
        status: "error",
        message: "Une catégorie ne peut pas être son propre univers.",
        errors: { parentId: "Choisissez un autre univers." },
        values,
      };
    }
    return id
      ? supabase.from("categories").update(parsed.data).eq("id", id)
      : supabase.from("categories").insert(parsed.data);
  }
  const parsed = brandSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  return id
    ? supabase.from("brands").update(parsed.data).eq("id", id)
    : supabase.from("brands").insert(parsed.data);
}

export async function saveTaxonomy(
  entity: Entity,
  id: string | null,
  formData: FormData,
): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const config = entities[entity];
  const values = readForm(formData);
  const result = await write(supabase, entity, id, values);
  if ("status" in result) return result;
  if (result.error) {
    const message = dbErrorMessage(result.error, { slug: config.slugTaken });
    return {
      status: "error",
      message,
      errors: message === config.slugTaken ? { slug: message } : undefined,
      values,
    };
  }
  updateTag(CATALOG_TAG);
  redirect(`${config.list}?ok=${id ? "enregistre" : "cree"}`);
}

export async function deleteTaxonomy(
  entity: Entity,
  id: string,
): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const config = entities[entity];
  const { data, error } = await supabase
    .from(entity)
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (isInUseError(error)) return { status: "error", message: config.inUse };
  if (error || !data) {
    return {
      status: "error",
      message: error ? dbErrorMessage(error) : "Cet élément n'existe plus.",
    };
  }
  updateTag(CATALOG_TAG);
  redirect(`${config.list}?ok=supprime`);
}
