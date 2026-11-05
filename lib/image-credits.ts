/**
 * Crédits des images du site, affichés dans les mentions légales.
 *
 * - Photos produits : Open Food Facts, licence CC BY-SA 3.0. Attribution
 *   obligatoire (Open Food Facts + lien) ; les versions recadrées et
 *   redimensionnées publiées ici restent sous la même licence.
 * - Photos du hero : licence Unsplash, choisies par Notym. Usage commercial
 *   gratuit, crédit facultatif mais indiqué.
 */

export type ImageCredit = {
  /** Chemin de l'image sur le site */
  file: string;
  subject: string;
  author: string;
  sourceUrl: string;
  license: "CC BY-SA 3.0" | "Licence Unsplash";
  licenseUrl: string;
  /** Modifications apportées à l'image d'origine */
  changes?: string;
};

const OFF_LICENSE = {
  author: "Contributeurs Open Food Facts",
  license: "CC BY-SA 3.0" as const,
  licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.fr",
  changes: "recadrage, fond blanchi, redimensionnement",
};

const off = (file: string, subject: string, code: string): ImageCredit => ({
  file,
  subject,
  sourceUrl: `https://fr.openfoodfacts.org/produit/${code}`,
  ...OFF_LICENSE,
});

const UNSPLASH_LICENSE = {
  license: "Licence Unsplash" as const,
  licenseUrl: "https://unsplash.com/fr/licence",
};

export const productImageCredits: ImageCredit[] = [
  off(
    "/products/coca-cola-1-5-l-x24.webp",
    "Coca-Cola Original Taste 1,5 L",
    "5449000000439",
  ),
  off(
    "/products/lipton-ice-tea-33-cl-x12.webp",
    "Lipton Ice Tea pêche 33 cl",
    "3228886030011",
  ),
  off(
    "/products/hawai-33-cl-x24.webp",
    "Hawaï Tropical 33 cl",
    "5449000224590",
  ),
  off(
    "/products/capri-sun-20-cl-x10.webp",
    "Capri-Sun Multivitamines, pack de 10 × 20 cl",
    "4000177158326",
  ),
  off("/products/red-bull-25-cl-x24.webp", "Red Bull 25 cl", "90162602"),
  off(
    "/products/minute-maid-orange-33-cl-x24.webp",
    "Minute Maid Orange, bouteille 33 cl",
    "87303223",
  ),
  off("/products/perrier.webp", "Perrier, canette slim 25 cl", "7613034579942"),
];

export const heroImageCredits: ImageCredit[] = [
  {
    file: "/hero/boissons.webp",
    subject: "Rayon de canettes de sodas",
    // Nom du photographe non identifié : à compléter depuis la page Unsplash.
    author: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1588238142232-7108fb7dcbb6",
    ...UNSPLASH_LICENSE,
  },
  {
    file: "/hero/sucre.webp",
    subject: "Carton de barres chocolatées",
    author: "Denny Müller",
    sourceUrl:
      "https://unsplash.com/fr/photos/cardboard-box-filled-with-chocolate-bars-mGP8gyGb8zY",
    ...UNSPLASH_LICENSE,
  },
  {
    file: "/hero/sale.webp",
    subject: "Rayon de nouilles instantanées",
    author: "Zoshua Colah",
    sourceUrl:
      "https://unsplash.com/fr/photos/emballages-de-nouilles-instantanees-sur-les-etageres-des-magasins-MP1w4QdqTBA",
    ...UNSPLASH_LICENSE,
  },
];
