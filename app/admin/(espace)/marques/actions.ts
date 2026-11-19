"use server";

import type { AdminFormState } from "@/lib/admin/forms";
import { deleteTaxonomy, saveTaxonomy } from "@/lib/admin/taxonomy";

/** Crée (id null) ou modifie une marque. */
export async function saveBrand(
  id: string | null,
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  return saveTaxonomy("brands", id, formData);
}

export async function deleteBrand(id: string): Promise<AdminFormState> {
  return deleteTaxonomy("brands", id);
}
