import { site } from "./site";

/** Données structurées LocalBusiness (grossiste) pour l'accueil. */
export function localBusinessJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    "@id": `${site.url}/#entreprise`,
    name: site.name,
    legalName: site.legal.companyName,
    description: site.description,
    url: site.url,
    logo: `${site.url}/brand/notym-logo.png`,
    image: `${site.url}/brand/notym-logo.png`,
    telephone: site.contact.phoneInternational,
    email: site.contact.email,
    vatID: site.legal.vatNumber.replace(/\s/g, ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.streetAddress,
      postalCode: site.contact.postalCode,
      addressLocality: site.contact.city,
      addressRegion: site.contact.region,
      addressCountry: site.contact.country,
    },
    areaServed: { "@type": "Country", name: "France" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.days,
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
  };
}

/** Fil d'Ariane schema.org (BreadcrumbList). */
export function breadcrumbJsonLd(
  items: ReadonlyArray<{ label: string; href?: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${site.url}${item.href}` } : {}),
    })),
  };
}

type ProductJsonLdInput = {
  name: string;
  slug: string;
  sku: string | null;
  brand: string | null;
  category: string | null;
  description: string | null;
  images: string[];
  priceFromHtCents: number | null;
  inStock: boolean;
};

/**
 * Données structurées Product. L'offre n'est décrite que si un prix est
 * renseigné (jamais de prix inventé).
 */
export function productJsonLd(
  product: ProductJsonLdInput,
): Record<string, unknown> {
  const url = `${site.url}/produit/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url,
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.brand
      ? { brand: { "@type": "Brand", name: product.brand } }
      : {}),
    ...(product.category ? { category: product.category } : {}),
    ...(product.description ? { description: product.description } : {}),
    ...(product.images.length > 0
      ? {
          image: product.images.map((src) =>
            src.startsWith("http") ? src : `${site.url}${src}`,
          ),
        }
      : {}),
    ...(product.priceFromHtCents !== null
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "EUR",
            price: (product.priceFromHtCents / 100).toFixed(2),
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: (product.priceFromHtCents / 100).toFixed(2),
              priceCurrency: "EUR",
              valueAddedTaxIncluded: false,
            },
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            seller: { "@id": `${site.url}/#entreprise` },
          },
        }
      : {}),
  };
}
