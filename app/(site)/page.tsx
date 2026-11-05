import type { Metadata } from "next";
import { HeroUniverses } from "@/components/home/hero-universes";
import { ProBand } from "@/components/layout/pro-band";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductCard } from "@/components/shop/product-card";
import { ProductGrid } from "@/components/shop/product-grid";
import { SectionHeader } from "@/components/ui/section-header";
import { getBrands, getFeaturedProducts } from "@/lib/catalog/queries";
import { localBusinessJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${site.name} — ${site.tagline}` },
  description: site.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [featured, brands] = await Promise.all([
    getFeaturedProducts(4),
    getBrands(),
  ]);

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />

      <HeroUniverses />

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
