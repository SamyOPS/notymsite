import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/auth";
import { articleFormValues } from "@/lib/admin/form-values";
import { saveArticle } from "../actions";
import { ArticleForm } from "../article-form";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Nouvelle actualité" };

export default async function NewArticlePage() {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Nouvelle actualité"
        back={{ href: "/admin/actualites", label: "Actualités" }}
      />
      <ArticleForm
        action={saveArticle.bind(null, null)}
        initial={articleFormValues()}
        isNew
      />
    </div>
  );
}
