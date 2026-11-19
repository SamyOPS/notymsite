import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteForm } from "@/components/admin/form-ui";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ButtonLink } from "@/components/ui/button";
import { getAdminArticle } from "@/lib/admin/data";
import { articleFormValues } from "@/lib/admin/form-values";
import { deleteArticle, saveArticle } from "../actions";
import { ArticleForm } from "../article-form";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Modifier une actualité" };

export default async function EditArticlePage({
  params,
}: PageProps<"/admin/actualites/[id]">) {
  const { id } = await params;
  const article = await getAdminArticle(id);
  if (!article) notFound();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={article.title}
        back={{ href: "/admin/actualites", label: "Actualités" }}
        actions={
          article.published && (
            <ButtonLink
              href={`/actualites/${article.slug}`}
              target="_blank"
              variant="secondary"
            >
              Voir la page
              <ExternalLink aria-hidden />
            </ButtonLink>
          )
        }
      />
      <ArticleForm
        action={saveArticle.bind(null, article.id)}
        initial={articleFormValues(article)}
        isNew={false}
      />
      <section
        aria-label="Supprimer l'actualité"
        className="border-t border-line pt-6"
      >
        <DeleteForm
          action={deleteArticle.bind(null, article.id)}
          confirmMessage={`Supprimer définitivement « ${article.title} » ?`}
          label="Supprimer l'actualité"
        />
      </section>
    </div>
  );
}
