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
import { articleSchema } from "@/lib/admin/schemas";
import { NEWS_TAG } from "@/lib/news/queries";
import { firstErrors } from "@/lib/validation/fields";

const SLUG_TAKEN = "Cette adresse est déjà utilisée par une autre actualité.";

export async function saveArticle(
  id: string | null,
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const values = readForm(formData, ["coverUrl"]);
  const parsed = articleSchema.safeParse(values);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Certains champs sont à corriger.",
      errors: firstErrors(parsed.error),
      values,
    };
  }

  let previous: { cover_url: string | null; published_at: string | null } = {
    cover_url: null,
    published_at: null,
  };
  if (id) {
    const { data } = await supabase
      .from("articles")
      .select("cover_url, published_at")
      .eq("id", id)
      .maybeSingle();
    if (!data) {
      return {
        status: "error",
        message: "Cette actualité n'existe plus.",
        values,
      };
    }
    previous = data;
  }

  const { publishedOn, ...fields } = parsed.data;
  const row = {
    ...fields,
    // Date choisie, sinon date d'origine, sinon maintenant à la publication.
    published_at:
      publishedOn ??
      previous.published_at ??
      (fields.published ? new Date().toISOString() : null),
  };

  const { error } = id
    ? await supabase.from("articles").update(row).eq("id", id)
    : await supabase.from("articles").insert(row);
  if (error) {
    const message = dbErrorMessage(error, { slug: SLUG_TAKEN });
    return {
      status: "error",
      message,
      errors: message === SLUG_TAKEN ? { slug: message } : undefined,
      values,
    };
  }

  if (previous.cover_url && previous.cover_url !== row.cover_url) {
    await removeMedia(supabase, [previous.cover_url]);
  }
  updateTag(NEWS_TAG);
  redirect(`/admin/actualites?ok=${id ? "enregistre" : "cree"}`);
}

export async function deleteArticle(id: string): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id)
    .select("cover_url")
    .maybeSingle();
  if (error || !data) {
    return {
      status: "error",
      message: error ? dbErrorMessage(error) : "Cette actualité n'existe plus.",
    };
  }
  if (data.cover_url) await removeMedia(supabase, [data.cover_url]);
  updateTag(NEWS_TAG);
  redirect("/admin/actualites?ok=supprime");
}
