import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Pages statiques. Le catalogue et les fiches produit s'y ajouteront à l'étape 5. */
const staticRoutes: Array<{ path: string; priority: number }> = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.7 },
  { path: "/devenir-client", priority: 0.8 },
  { path: "/actualites", priority: 0.5 },
  { path: "/mentions-legales", priority: 0.2 },
  { path: "/cgv", priority: 0.2 },
  { path: "/confidentialite", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    priority,
  }));
}
