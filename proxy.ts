import { NextResponse, type NextRequest } from "next/server";
import { refreshAdminSession } from "@/lib/admin/session-proxy";
import { checkCatalogPath } from "@/lib/catalog/known-paths";

/**
 * - /admin : rafraîchit la session Supabase (les Server Components ne peuvent
 *   pas réécrire les cookies) et renvoie vers la connexion sans session. Ce
 *   n'est qu'un premier filtre : chaque page et chaque action de l'admin
 *   vérifie elle-même les droits.
 * - Produit, catégorie ou actualité inconnus : on sert la page 404 avec un
 *   vrai statut 404, avant que le rendu (en streaming) ne fige un statut 200.
 * - Anciennes fiches produit (/product/1) : redirection permanente.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return refreshAdminSession(request);
  }

  const result = await checkCatalogPath(pathname);
  if (result.kind === "redirect") {
    return NextResponse.redirect(new URL(result.location, request.url), 308);
  }
  if (result.kind === "not-found") {
    return NextResponse.rewrite(new URL("/page-introuvable", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/produit/:slug",
    "/catalogue/:categorie",
    "/actualites/:slug",
    "/product/:id",
    "/admin",
    "/admin/:path*",
  ],
};
