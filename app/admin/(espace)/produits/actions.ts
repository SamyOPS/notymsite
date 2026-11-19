"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  dbErrorMessage,
  readForm,
  type AdminFormState,
} from "@/lib/admin/forms";
import { removeMedia } from "@/lib/admin/media-server";
import { productSchema } from "@/lib/admin/schemas";
import { CATALOG_TAG } from "@/lib/catalog/queries";
import { firstErrors } from "@/lib/validation/fields";

const UNIQUE = {
  slug: "Cette adresse est déjà utilisée par un autre produit.",
  sku: "Cette référence est déjà utilisée par un autre produit.",
};

/** Crée (id null) ou modifie un produit. */
export async function saveProduct(
  id: string | null,
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const values = readForm(formData, ["images"]);
  const parsed = productSchema.safeParse(values);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Certains champs sont à corriger.",
      errors: firstErrors(parsed.error),
      values,
    };
  }

  let previousImages: string[] = [];
  if (id) {
    const { data } = await supabase
      .from("products")
      .select("images")
      .eq("id", id)
      .maybeSingle();
    if (!data) {
      return { status: "error", message: "Ce produit n'existe plus.", values };
    }
    previousImages = data.images;
  }

  const { error } = id
    ? await supabase.from("products").update(parsed.data).eq("id", id)
    : await supabase.from("products").insert(parsed.data);
  if (error) {
    const message = dbErrorMessage(error, UNIQUE);
    const field = Object.entries(UNIQUE).find(([, m]) => m === message)?.[0];
    return {
      status: "error",
      message,
      errors: field ? { [field]: message } : undefined,
      values,
    };
  }

  await removeMedia(
    supabase,
    previousImages.filter((url) => !parsed.data.images?.includes(url)),
  );
  updateTag(CATALOG_TAG);
  redirect(`/admin/produits?ok=${id ? "enregistre" : "cree"}`);
}

export async function deleteProduct(id: string): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select("images")
    .maybeSingle();
  if (error || !data) {
    return {
      status: "error",
      message: error ? dbErrorMessage(error) : "Ce produit n'existe plus.",
    };
  }
  await removeMedia(supabase, data.images);
  updateTag(CATALOG_TAG);
  redirect("/admin/produits?ok=supprime");
}
