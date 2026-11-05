/**
 * Crédits des images du site, affichés dans les mentions légales.
 *
 * - Photos produits : Open Food Facts, licence CC BY-SA 3.0. Attribution
 *   obligatoire (Open Food Facts + lien) ; les versions recadrées et
 *   redimensionnées publiées ici restent sous la même licence.
 * - Photos du hero : domaine public (CC0), crédit facultatif mais indiqué.
 */

export type ImageCredit = {
  /** Chemin de l'image sur le site */
  file: string;
  subject: string;
  author: string;
  sourceUrl: string;
  license: "CC BY-SA 3.0" | "CC0 1.0";
  licenseUrl: string;
  /** Modifications apportées à l'image d'origine */
  changes?: string;
};

const OFF_LICENSE = {
  author: "Contributeurs Open Food Facts",
  license: "CC BY-SA 3.0" as const,
  licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.fr",
  changes: "recadrage, fond blanc, redimensionnement",
};

const off = (file: string, subject: string, code: string): ImageCredit => ({
  file,
  subject,
  sourceUrl: `https://fr.openfoodfacts.org/produit/${code}`,
  ...OFF_LICENSE,
});

const CC0 = {
  license: "CC0 1.0" as const,
  licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.fr",
};

export const productImageCredits: ImageCredit[] = [
  off("/products/coca-cola-1-5-l-x24.webp", "Coca-Cola 1,5 L", "5000112523065"),
  off(
    "/products/lipton-ice-tea-33-cl-x12.webp",
    "Lipton Ice Tea pêche 33 cl",
    "8474034088877",
  ),
  off(
    "/products/hawai-33-cl-x24.webp",
    "Hawaï Tropical 33 cl",
    "5449000224590",
  ),
  off(
    "/products/capri-sun-20-cl-x10.webp",
    "Capri-Sun Multivitamin 20 cl",
    "3760079798211",
  ),
  off("/products/red-bull-25-cl-x24.webp", "Red Bull 25 cl", "90162602"),
  off(
    "/products/minute-maid-orange-33-cl-x24.webp",
    "Minute Maid Orange 33 cl",
    "3292090941579",
  ),
  off("/products/perrier.webp", "Perrier 33 cl", "7613034479112"),
];

export const heroImageCredits: ImageCredit[] = [
  {
    file: "/hero/boissons.webp",
    subject: "Bouteilles de sodas",
    author: "Topher (WordPress Photos)",
    sourceUrl: "https://wordpress.org/photos/photo/40666954e4/",
    ...CC0,
  },
  {
    file: "/hero/sucre.webp",
    subject: "Tablette de chocolat",
    author: "rawpixel",
    sourceUrl: "https://www.rawpixel.com/image/5905466",
    ...CC0,
  },
  {
    file: "/hero/sale.webp",
    subject: "Chips",
    author: "rawpixel",
    sourceUrl: "https://www.rawpixel.com/image/5914193",
    ...CC0,
  },
];
