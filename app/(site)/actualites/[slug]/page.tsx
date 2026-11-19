import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getArticle } from "@/lib/news/queries";
import { formatLongDate, toParagraphs } from "@/lib/news/text";
import { breadcrumbJsonLd } from "@/lib/seo";

/*
 * Pas de generateStaticParams : avec Cache Components, il devrait renvoyer
 * au moins un article, ce qui n'est pas garanti. La page est donc rendue à la
 * demande (instant = false : le header, qui lit l'URL, ne peut pas être
 * prérendu sans paramètre connu). Les données restent en cache
 * (lib/news/queries.ts).
 */
export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/actualites/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article)
    return { title: "Actualité introuvable", robots: { index: false } };
  return {
    title: article.title,
    description: article.excerpt || undefined,
    alternates: { canonical: `/actualites/${article.slug}` },
    openGraph: {
      type: "article",
      publishedTime: article.publishedAt,
      images: article.coverUrl ? [article.coverUrl] : undefined,
    },
  };
}

export default function ArticlePage({
  params,
}: PageProps<"/actualites/[slug]">) {
  return (
    <Suspense fallback={<div className="container-site min-h-[60vh] py-6" />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}

async function ArticleContent({
  params,
}: Pick<PageProps<"/actualites/[slug]">, "params">) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const breadcrumb = [
    { label: "Accueil", href: "/" },
    { label: "Actualités", href: "/actualites" },
    { label: article.title },
  ];

  return (
    <article className="container-site pt-6">
      <JsonLd data={breadcrumbJsonLd(breadcrumb)} />
      <Breadcrumb items={breadcrumb} />
      <header className="mt-6 max-w-3xl">
        <p className="text-caption text-ink-muted">
          <time dateTime={article.publishedAt}>
            {formatLongDate(article.publishedAt)}
          </time>
        </p>
        <h1 className="mt-3 text-h1">{article.title}</h1>
        {article.excerpt && (
          <p className="mt-4 text-body-lg text-ink-muted">{article.excerpt}</p>
        )}
      </header>

      {article.coverUrl && (
        <div className="relative mt-10 aspect-[16/9] max-w-4xl overflow-hidden bg-teal-soft">
          <Image
            src={article.coverUrl}
            alt={article.coverAlt}
            fill
            preload
            sizes="(min-width: 1024px) 896px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-10 flex max-w-2xl flex-col gap-5 border-t border-ink pt-8 text-body-lg">
        {toParagraphs(article.content).map((lines, index) => (
          <p key={index}>
            {lines.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        ))}
      </div>
    </article>
  );
}
