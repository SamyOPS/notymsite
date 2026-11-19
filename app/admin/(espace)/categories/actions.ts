"use server";

import type { AdminFormState } from "@/lib/admin/forms";
import { deleteTaxonomy, saveTaxonomy } from "@/lib/admin/taxonomy";

/** Crée (id null) ou modifie une catégorie. */
export async function saveCategory(
  id: string | null,
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  return saveTaxonomy("categories", id, formData);
}

export async function deleteCategory(id: string): Promise<AdminFormState> {
  return deleteTaxonomy("categories", id);
}
