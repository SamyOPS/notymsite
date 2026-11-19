/**
 * Redirections permanentes des URL de l'ancien site vers les nouvelles,
 * pour conserver le référencement et les liens existants.
 * Les anciennes fiches produit (/product/1) sont redirigées par proxy.ts,
 * d'après la colonne legacy_id des produits.
 */
export function legacyRedirects() {
  return [
    { source: "/shop", destination: "/catalogue", permanent: true },
    {
      source: "/shop/boissons",
      destination: "/catalogue/boissons",
      permanent: true,
    },
    {
      source: "/shop/snacks",
      destination: "/catalogue/epicerie-salee",
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
  ];
}
