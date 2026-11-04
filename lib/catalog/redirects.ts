import { products } from "./data";

/**
 * Redirections permanentes des URL de l'ancien site vers les nouvelles,
 * pour conserver le référencement et les liens existants.
 */
export function legacyRedirects() {
  const productRedirects = products.flatMap((p) =>
    p.legacyId === null
      ? []
      : [
          {
            source: `/product/${p.legacyId}`,
            destination: `/produit/${p.slug}`,
            permanent: true,
          },
        ],
  );

  return [
    { source: "/shop", destination: "/catalogue", permanent: true },
    { source: "/shop/boissons", destination: "/catalogue", permanent: true },
    {
      source: "/shop/snacks",
      destination: "/catalogue/chips-snacks",
      permanent: true,
    },
    { source: "/service", destination: "/services", permanent: true },
    {
      source: "/politique-confidentialite",
      destination: "/confidentialite",
      permanent: true,
    },
    { source: "/cart", destination: "/devis", permanent: true },
    { source: "/wishlist", destination: "/catalogue", permanent: true },
    ...productRedirects,
  ];
}
