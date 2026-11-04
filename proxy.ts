import { NextResponse, type NextRequest } from "next/server";
import { isKnownCatalogPath } from "@/lib/catalog/routing";

/**
 * Produit ou catégorie inconnus : on sert la page 404 avec un vrai statut
 * 404, avant que le rendu (en streaming) ne fige un statut 200.
 */
export function proxy(request: NextRequest) {
  if (isKnownCatalogPath(request.nextUrl.pathname)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/page-introuvable", request.url));
}

export const config = {
  matcher: ["/produit/:slug", "/catalogue/:categorie"],
};
