"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  dbErrorMessage,
  readForm,
  type AdminFormState,
} from "@/lib/admin/forms";
import { requestUpdateSchema } from "@/lib/admin/schemas";
import { firstErrors } from "@/lib/validation/fields";

/** Statut et notes internes d'une demande. */
export async function updateRequest(
  id: string,
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const values = readForm(formData);
  const parsed = requestUpdateSchema.safeParse(values);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Certains champs sont à corriger.",
      errors: firstErrors(parsed.error),
      values,
    };
  }
  const { data, error } = await supabase
    .from("requests")
    .update(parsed.data)
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !data) {
    return {
      status: "error",
      message: error ? dbErrorMessage(error) : "Cette demande n'existe plus.",
      values,
    };
  }
  redirect(`/admin/demandes/${id}?ok=enregistre`);
}

export async function deleteRequest(id: string): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("requests")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !data) {
    return {
      status: "error",
      message: error ? dbErrorMessage(error) : "Cette demande n'existe plus.",
    };
  }
  redirect("/admin/demandes?ok=supprime");
}
