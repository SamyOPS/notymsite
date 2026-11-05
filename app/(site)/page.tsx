import type { Metadata } from "next";
import Link from "next/link";
import { ProBand } from "@/components/layout/pro-band";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductCard } from "@/components/shop/product-card";
import { ProductGrid } from "@/components/shop/product-grid";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { Trait } from "@/components/ui/trait";
import {
  getBrands,
  getFeaturedProducts,
  searchCatalog,
} from "@/lib/catalog/queries";
import { parseCatalogParams } from "@/lib/catalog/search";
import { localBusinessJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${site.name} — ${site.tagline}` },
  description: site.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [overview, featured, brands] = await Promise.all([
    searchCatalog(parseCatalogParams({})),
    getFeaturedProducts(4),
    getBrands(),
  ]);

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />

      <section aria-labelledby="hero-titre" className="surface-inverse">
        <div className="container-site grid gap-14 py-16 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:py-24">
          <div>
            <h1 id="hero-titre" className="text-display">
              Vos boissons en gros, <Trait>livrées vite.</Trait>
            </h1>
            <p className="mt-8 max-w-xl text-body-lg">
              Sodas, eaux, énergisants, jus et snacks pour les commerces et la
              restauration. Livraison partout en France ou retrait au dépôt de
              Montataire (60).
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/catalogue" size="lg">
                Voir le catalogue
              </ButtonLink>
              <ButtonLink href="/devenir-client" size="lg" variant="secondary">
                Devenir client
              </ButtonLink>
            </div>
          </div>

          {/* Index des catégories : sert de navigation, pas de décor. */}
          <nav aria-labelledby="hero-categories">
            <h2 id="hero-categories" className="font-sans text-label">
              Catégories
            </h2>
            <ul className="mt-3 border-t border-current/30">
              {overview.facets.categories.map((category) => (
                <li key={category.value} className="border-b border-current/30">
                  <Link
                    href={`/catalogue/${category.value}`}
                    className="flex min-h-16 items-center justify-between gap-4 font-display text-h3 transition-colors hover:text-accent-text"
                  >
                    {category.label}
                    <span className="font-sans text-body tabular-nums">
                      <span aria-hidden>{category.count}</span>
                      <span className="sr-only">
                        , {category.count} produit
                        {category.count > 1 ? "s" : ""}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section aria-labelledby="phares-titre" className="container-site pt-20">
        <SectionHeader
          title="Produits phares"
          titleId="phares-titre"
          href="/catalogue"
          linkLabel="Tout le catalogue"
        />
        <ProductGrid className="mt-8">
          {featured.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ProductGrid>
        <p className="mt-8 max-w-4xl text-body text-ink-muted">
          <span className="font-semibold text-ink">Marques distribuées :</span>{" "}
          {brands.map((b) => b.name).join(", ")}.
        </p>
      </section>

      <ProBand />
    </>
  );
}
