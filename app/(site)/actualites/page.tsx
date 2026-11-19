import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getArticles } from "@/lib/news/queries";
import { formatLongDate } from "@/lib/news/text";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Les actualités de Notym : nouveautés, arrivages et informations pratiques.",
  alternates: { canonical: "/actualites" },
};

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Actualités" }]}
        title="Actualités"
        intro={<p>Nouveautés, arrivages et informations pratiques.</p>}
      />
      <div className="container-site">
        {articles.length === 0 ? (
          <EmptyState
            title="Aucune actualité pour le moment"
            description={
              <p>Revenez bientôt, ou consultez le catalogue en attendant.</p>
            }
            actions={
              <ButtonLink href="/catalogue">Voir le catalogue</ButtonLink>
            }
            className="py-20"
          />
        ) : (
          <ul className="grid border-t border-ink">
            {articles.map((article, index) => (
              <li
                key={article.slug}
                className="group relative grid gap-6 border-b border-line py-8 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-10"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-teal-soft">
                  {article.coverUrl && (
                    <Image
                      src={article.coverUrl}
                      alt=""
                      fill
                      // Premier visuel de la page : chargé en priorité.
                      preload={index === 0}
                      sizes="(min-width: 640px) 256px, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-caption text-ink-muted">
                    <time dateTime={article.publishedAt}>
                      {formatLongDate(article.publishedAt)}
                    </time>
                  </p>
                  <h2 className="text-h3">
                    <Link
                      href={`/actualites/${article.slug}`}
                      className="underline-offset-4 group-hover:underline after:absolute after:inset-0"
                    >
                      {article.title}
                    </Link>
                  </h2>
                  {article.excerpt && (
                    <p className="max-w-2xl text-body text-ink-muted">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
