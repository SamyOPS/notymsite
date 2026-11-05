import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { AddToQuotePanel } from "@/components/shop/add-to-quote-panel";
import { PriceTag } from "@/components/shop/price-tag";
import { ProductCard } from "@/components/shop/product-card";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductGrid } from "@/components/shop/product-grid";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { SectionHeader } from "@/components/ui/section-header";
import { Tabs } from "@/components/ui/tabs";
import {
  getAllProductSlugs,
  getProductDetail,
  getRelatedProducts,
} from "@/lib/catalog/queries";
import { formatPrice, packagingLabel, unitPriceCents } from "@/lib/format";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getProductDetail(slug);
  if (!detail)
    return { title: "Produit introuvable", robots: { index: false } };
  const { product, brand } = detail;
  const packaging = packagingLabel(product.packLabel, product.volume);
  return {
    title: `${product.name} — ${product.packLabel}`,
    description: `${product.name}${brand ? ` (${brand.name})` : ""} : ${packaging}. Vente en gros aux professionnels, devis sur demande.`,
    alternates: { canonical: `/produit/${product.slug}` },
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/produit/[slug]">) {
  const { slug } = await params;
  const detail = await getProductDetail(slug);
  if (!detail) notFound();
  const { product, brand, category, universe } = detail;
  const related = await getRelatedProducts(product.id, 4);

  const breadcrumb: Crumb[] = [
    { label: "Accueil", href: "/" },
    { label: "Catalogue", href: "/catalogue" },
    ...(universe
      ? [{ label: universe.name, href: `/catalogue/${universe.slug}` }]
      : []),
    ...(category
      ? [{ label: category.name, href: `/catalogue/${category.slug}` }]
      : []),
    { label: product.name },
  ];
  const showPrices = site.features.showPrices;
  const unitPrice =
    showPrices && product.priceFromHtCents !== null && product.unitsPerPack
      ? unitPriceCents(product.priceFromHtCents, product.unitsPerPack)
      : null;
  const hasBadges =
    product.inStock !== null ||
    product.isBestSeller ||
    product.isPromo ||
    product.isNew;

  const characteristics: Array<[string, string]> = [
    ["Marque", brand?.name ?? "Non renseignée"],
    ["Contenance", product.volume ?? "À confirmer"],
    [
      "Unités par pack",
      product.unitsPerPack ? String(product.unitsPerPack) : "À confirmer",
    ],
    ["Conditionnement", product.packLabel],
    ["Catégorie", category?.name ?? "Non renseignée"],
    ["Référence", product.sku ?? "Non renseignée"],
  ];

  return (
    <>
      <JsonLd
        data={productJsonLd({
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          brand: brand?.name ?? null,
          category: category?.name ?? null,
          description: product.description,
          images: product.images,
          priceFromHtCents: showPrices ? product.priceFromHtCents : null,
          inStock: product.inStock,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(breadcrumb)} />

      <div className="container-site py-6">
        <Breadcrumb items={breadcrumb} />
      </div>

      <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col gap-6">
          {hasBadges && (
            <div className="flex flex-wrap gap-2">
              {product.inStock === true && <Badge variant="in-stock" />}
              {product.inStock === false && <Badge variant="out-of-stock" />}
              {product.isBestSeller && <Badge variant="best-seller" />}
              {product.isPromo && <Badge variant="promo" />}
              {product.isNew && <Badge variant="new" />}
            </div>
          )}

          <div>
            {brand && <p className="text-label text-ink-muted">{brand.name}</p>}
            <h1 className="mt-1 text-h1">{product.name}</h1>
            <p className="mt-3 text-body-lg">
              {packagingLabel(product.packLabel, product.volume)}
              {product.sku && (
                <span className="text-ink-muted"> · Réf. {product.sku}</span>
              )}
            </p>
          </div>

          {showPrices ? (
            <div className="flex flex-col gap-2 surface-teal-soft p-6">
              <PriceTag priceFromHtCents={product.priceFromHtCents} size="lg" />
              {unitPrice !== null && (
                <p className="text-body text-ink-muted">
                  soit à partir de {formatPrice(unitPrice)} HT l&apos;unité
                </p>
              )}
              <p className="text-caption text-ink-muted">
                {product.priceFromHtCents === null
                  ? "Ajoutez ce produit à votre demande : son prix figurera sur votre devis."
                  : "Prix indicatif hors taxes. Le prix définitif figure sur votre devis."}
              </p>
            </div>
          ) : (
            <p className="text-body-lg text-ink-muted">
              Ajoutez ce produit à votre demande : notre équipe vous répond avec
              un devis.
            </p>
          )}

          <AddToQuotePanel
            productId={product.id}
            productName={product.name}
            packLabel={product.packLabel}
            disabled={product.inStock === false}
          />

          <p className="border-t border-line pt-6 text-body text-ink-muted">
            {site.delivery.shipping}. {site.delivery.pickup}.
          </p>

          <Tabs
            label="Informations sur le produit"
            className="mt-4"
            tabs={[
              {
                id: "description",
                label: "Description",
                content: (
                  <p className="text-body text-ink-muted">
                    {product.description ?? "Description à venir."}
                  </p>
                ),
              },
              {
                id: "caracteristiques",
                label: "Caractéristiques",
                content: (
                  <dl className="grid grid-cols-[minmax(0,10rem)_1fr] gap-x-6 text-body">
                    {characteristics.map(([term, value]) => (
                      <div
                        key={term}
                        className="col-span-2 grid grid-cols-subgrid border-b border-line py-3"
                      >
                        <dt className="text-ink-muted">{term}</dt>
                        <dd className="font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                ),
              },
            ]}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section
          aria-labelledby="similaires-titre"
          className="container-site pt-20"
        >
          <SectionHeader
            title="Dans la même catégorie"
            titleId="similaires-titre"
            href={category ? `/catalogue/${category.slug}` : "/catalogue"}
            linkLabel={
              category ? `Tout « ${category.name} »` : "Tout le catalogue"
            }
          />
          <ProductGrid className="mt-8">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ProductGrid>
        </section>
      )}
    </>
  );
}
