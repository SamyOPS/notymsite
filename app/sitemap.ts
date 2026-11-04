import type { MetadataRoute } from "next";
import { getAllProductSlugs, getCategories } from "@/lib/catalog/queries";
import { site } from "@/lib/site";

const staticRoutes: Array<{ path: string; priority: number }> = [
  { path: "/", priority: 1 },
  { path: "/catalogue", priority: 0.9 },
  { path: "/services", priority: 0.7 },
  { path: "/devenir-client", priority: 0.8 },
  { path: "/actualites", priority: 0.5 },
  { path: "/mentions-legales", priority: 0.2 },
  { path: "/cgv", priority: 0.2 },
  { path: "/confidentialite", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, productSlugs] = await Promise.all([
    getCategories(),
    getAllProductSlugs(),
  ]);
  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${site.url}${path}`,
      priority,
    })),
    ...categories.map((c) => ({
      url: `${site.url}/catalogue/${c.slug}`,
      priority: 0.8,
    })),
    ...productSlugs.map((slug) => ({
      url: `${site.url}/produit/${slug}`,
      priority: 0.6,
    })),
  ];
}
