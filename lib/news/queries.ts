import "server-only";
import { cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Actualités publiées. L'admin appelle updateTag(NEWS_TAG) après chaque
 * modification.
 */

export const NEWS_TAG = "news";

export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  coverAlt: string;
  publishedAt: string;
};

export type Article = ArticleSummary & {
  content: string;
  updatedAt: string;
};

async function loadArticles(): Promise<Article[]> {
  "use cache";
  cacheTag(NEWS_TAG);
  const { data, error } = await createPublicClient()
    .from("articles")
    .select(
      "slug, title, excerpt, content, cover_url, cover_alt, published_at, updated_at",
    )
    .eq("published", true)
    .order("published_at", { ascending: false })
    .range(0, 999);
  if (error) throw error;
  return data.flatMap((a) =>
    a.published_at
      ? [
          {
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt,
            content: a.content,
            coverUrl: a.cover_url,
            coverAlt: a.cover_alt,
            publishedAt: a.published_at,
            updatedAt: a.updated_at,
          },
        ]
      : [],
  );
}

export async function getArticles(): Promise<ArticleSummary[]> {
  "use cache";
  cacheTag(NEWS_TAG);
  const articles = await loadArticles();
  return articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    coverUrl: a.coverUrl,
    coverAlt: a.coverAlt,
    publishedAt: a.publishedAt,
  }));
}

export async function getArticle(slug: string): Promise<Article | null> {
  "use cache";
  cacheTag(NEWS_TAG);
  const articles = await loadArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}
