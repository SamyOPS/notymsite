import { site } from "../site";

/**
 * Univers et catégories du site, et correspondance avec les familles de
 * l'export du logiciel de gestion (« BOISSONS / 33CL CANETTE »…).
 *
 * Les slugs sont fixes : ils servent d'adresse (/catalogue/canettes) et
 * permettent de réimporter un export sans dupliquer les catégories.
 */

export type TaxonomyCategory = {
  slug: string;
  name: string;
  description: string;
  /** Familles de l'export rangées dans cette catégorie (en majuscules). */
  families: string[];
};

export type TaxonomyUniverse = TaxonomyCategory & {
  categories: TaxonomyCategory[];
};

export const ALCOHOL_UNIVERSE = site.alcohol.universe;

export const taxonomy: TaxonomyUniverse[] = [
  {
    slug: "boissons",
    name: "Boissons",
    description: "Sodas, eaux, jus, sirops et énergisants",
    families: ["BOISSONS"],
    categories: [
      {
        slug: "canettes",
        name: "Canettes",
        description: "Sodas, thés glacés et jus en canettes de 25 et 33 cl",
        families: ["BOISSONS / 33CL CANETTE"],
      },
      {
        slug: "petites-bouteilles",
        name: "Bouteilles 50 cl",
        description: "Sodas et thés glacés en petites bouteilles",
        families: ["BOISSONS / 50CL PETITE BOUTEILLE"],
      },
      {
        slug: "grandes-bouteilles",
        name: "Bouteilles 1,5 L et 2 L",
        description: "Sodas et thés glacés en grandes bouteilles",
        families: ["BOISSONS / 1.5L 2L GRANDE BOUTEILLE"],
      },
      {
        slug: "eaux",
        name: "Eaux",
        description: "Eaux plates, gazeuses et aromatisées",
        families: ["BOISSONS / EAU"],
      },
      {
        slug: "jus-de-fruits",
        name: "Jus de fruits",
        description: "Pur jus, nectars, briks et compotes à boire",
        families: ["BOISSONS / JUS DE FRUIT"],
      },
      {
        slug: "sirops",
        name: "Sirops",
        description: "Sirops à diluer",
        families: ["BOISSONS / SIROP"],
      },
      {
        slug: "energisants",
        name: "Énergisants",
        description: "Boissons énergisantes et boissons pour le sport",
        families: ["BOISSONS / ENERGY DRINK"],
      },
      {
        slug: "boissons-exotiques",
        name: "Boissons exotiques",
        description: "Malt, ginger beer et boissons du monde",
        families: ["BOISSONS / BOISSON EXOTIQUE"],
      },
      {
        slug: "bouteilles-en-verre",
        name: "Bouteilles en verre",
        description:
          "Bouteilles en verre consigné pour les cafés et restaurants",
        families: ["BOISSONS / BOUTEILLE EN VERRE"],
      },
    ],
  },
  {
    slug: ALCOHOL_UNIVERSE,
    name: "Alcools",
    description: "Bières, vins et spiritueux",
    families: ["ALCOOL"],
    categories: [
      {
        slug: "bieres",
        name: "Bières",
        description: "Bières blondes, ambrées et aromatisées",
        families: ["ALCOOL / BIERE"],
      },
      {
        slug: "vins",
        name: "Vins et mousseux",
        description: "Vins rouges, rosés, blancs et mousseux",
        families: ["ALCOOL / VIN"],
      },
      {
        slug: "spiritueux",
        name: "Spiritueux",
        description: "Whiskies, rhums, vodkas, gins et liqueurs",
        families: [
          "ALCOOL / 25CL",
          "ALCOOL / 35CL",
          "ALCOOL / 50CL",
          "ALCOOL / 70CL",
          "ALCOOL / 1L",
        ],
      },
      {
        slug: "flasks",
        name: "Flasks 20 cl",
        description: "Spiritueux en flasks de 20 cl",
        families: ["ALCOOL / FLASK 20CL"],
      },
    ],
  },
  {
    slug: "epicerie-salee",
    name: "Épicerie salée",
    description: "Chips, conserves, pâtes, riz, épices et sauces",
    families: [],
    categories: [
      {
        slug: "chips-aperitif",
        name: "Chips et apéritif",
        description: "Chips, biscuits apéritif, cacahuètes et graines",
        families: ["ALIMENTAIRE / CHIPS/APERO"],
      },
      {
        slug: "conserves",
        name: "Conserves",
        description: "Légumes, poissons et champignons en conserve",
        families: ["ALIMENTAIRE / CONSERVES"],
      },
      {
        slug: "plats-prepares",
        name: "Plats préparés",
        description: "Plats cuisinés, soupes et nouilles",
        families: ["ALIMENTAIRE / PLATS PREPARER"],
      },
      {
        slug: "pates",
        name: "Pâtes",
        description: "Pâtes sèches",
        families: ["ALIMENTAIRE / PATES"],
      },
      {
        slug: "riz",
        name: "Riz",
        description: "Riz basmati, thaï, long grain et brisures",
        families: ["ALIMENTAIRE / RIZ"],
      },
      {
        slug: "semoule-farine",
        name: "Semoule et farine",
        description: "Semoules, couscous, farines et fécules",
        families: ["ALIMENTAIRE / SEMOULE FARINE"],
      },
      {
        slug: "legumes-secs",
        name: "Légumes secs",
        description: "Haricots, lentilles, pois et maïs",
        families: ["ALIMENTAIRE / LEGUMES SECS"],
      },
      {
        slug: "epices",
        name: "Épices",
        description: "Épices, mélanges et aromates",
        families: ["ALIMENTAIRE / EPICES"],
      },
      {
        slug: "condiments-sauces",
        name: "Condiments et sauces",
        description: "Sauces, moutardes, sel, sucre et conserves de tomate",
        families: ["ALIMENTAIRE / CONDIMENTS"],
      },
      {
        slug: "huiles",
        name: "Huiles",
        description: "Huiles de tournesol, d'olive et de palme",
        families: ["ALIMENTAIRE / HUILES"],
      },
    ],
  },
  {
    slug: "epicerie-sucree",
    name: "Épicerie sucrée",
    description: "Biscuits, confiserie, café, thé et petit-déjeuner",
    families: [],
    categories: [
      {
        slug: "biscuits",
        name: "Biscuits et gâteaux",
        description: "Biscuits, gaufrettes et gâteaux",
        families: ["ALIMENTAIRE / BISCUITS"],
      },
      {
        slug: "bonbons-vrac",
        name: "Bonbons en vrac",
        description: "Bonbons et chewing-gums en boîtes et présentoirs",
        families: ["BONBON / VRAC"],
      },
      {
        slug: "bonbons-sachets",
        name: "Bonbons en sachets",
        description: "Bonbons et chewing-gums en sachets",
        families: ["BONBON / SACHET"],
      },
      {
        slug: "sucettes",
        name: "Sucettes",
        description: "Sucettes à l'unité et en présentoirs",
        families: ["BONBON / SUCETTE"],
      },
      {
        slug: "chocolat",
        name: "Chocolat",
        description: "Barres chocolatées et confiserie de chocolat",
        families: ["BONBON / CHOCO"],
      },
      {
        slug: "petit-dejeuner",
        name: "Petit-déjeuner",
        description: "Confitures, céréales et pâtes à tartiner",
        families: ["ALIMENTAIRE / PETIT DEJ"],
      },
      {
        slug: "cafe",
        name: "Café",
        description: "Café moulu, soluble, en grains, capsules et dosettes",
        families: ["ALIMENTAIRE / CAFE"],
      },
      {
        slug: "the",
        name: "Thé",
        description: "Thés et infusions",
        families: ["ALIMENTAIRE / THE"],
      },
      {
        slug: "lait",
        name: "Lait",
        description: "Lait UHT, concentré, en poudre et lait de coco",
        families: ["ALIMENTAIRE / LAIT"],
      },
    ],
  },
  {
    slug: "surgeles",
    name: "Surgelés",
    description: "Poissons, viandes, légumes, glaces et snacks surgelés",
    families: [],
    categories: [
      {
        slug: "poissons-surgeles",
        name: "Poissons",
        description: "Poissons entiers, en darnes et fumés",
        families: ["SURGELES / POISSON"],
      },
      {
        slug: "viandes-surgelees",
        name: "Viandes et volailles",
        description: "Poulet, dinde, bœuf et viandes en morceaux",
        families: ["SURGELES / VIANDE"],
      },
      {
        slug: "legumes-surgeles",
        name: "Légumes",
        description: "Légumes et feuilles surgelés",
        families: ["SURGELES / LEGUMES"],
      },
      {
        slug: "glaces",
        name: "Glaces",
        description: "Cônes, bâtonnets et bacs de glace",
        families: ["SURGELES / GLACES"],
      },
      {
        slug: "crustaces",
        name: "Crustacés",
        description: "Crevettes et crabes",
        families: ["SURGELES / CRUSTACES"],
      },
      {
        slug: "snacks-surgeles",
        name: "Snacks et autres",
        description: "Nems, samoussas, frites et feuilles de brick",
        families: ["SURGELES / AUTRES"],
      },
    ],
  },
  {
    slug: "produits-exotiques",
    name: "Produits exotiques",
    description: "Produits d'Afrique, des Antilles et d'Asie",
    families: ["EXOTIQUE", "LEGUMES FRAIS", "BOISSONS / LAIT2"],
    categories: [],
  },
  {
    slug: "hygiene-entretien",
    name: "Hygiène et entretien",
    description: "Produits d'entretien, lessives et hygiène",
    families: ["HYGIENES"],
    categories: [],
  },
  {
    slug: "emballages",
    name: "Emballages et divers",
    description: "Gobelets, sacs, barquettes et consommables",
    families: ["EMBALLAGE", "DIVERS"],
    categories: [],
  },
  {
    slug: "animaux",
    name: "Animaux",
    description: "Alimentation et litière pour chats et chiens",
    families: ["ANIMAUX"],
    categories: [],
  },
];

const normalizeFamily = (family: string) =>
  family
    .toUpperCase()
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Catégorie (ou univers) où ranger une famille de l'export. Pour une famille
 * de premier niveau sans sous-famille (« BOISSONS »), le libellé du produit
 * permet de choisir le format.
 */
export function categoryForFamily(
  family: string,
  label: string,
): string | null {
  const key = normalizeFamily(family);
  if (key === "BOISSONS") return beverageByFormat(label);
  return familyIndex.get(key) ?? null;
}

/** Famille normalisée → slug de la catégorie (ou de l'univers). */
const familyIndex = new Map<string, string>();
for (const universe of taxonomy) {
  for (const family of universe.families) {
    familyIndex.set(normalizeFamily(family), universe.slug);
  }
  for (const category of universe.categories) {
    for (const family of category.families) {
      familyIndex.set(normalizeFamily(family), category.slug);
    }
  }
}

function beverageByFormat(label: string): string {
  const text = label.toUpperCase();
  if (/SIROP/.test(text)) return "sirops";
  if (/\b(1[.,]25|1[.,]5|2)\s*L\b|\bL\s*X\s*\d/.test(text)) {
    return "grandes-bouteilles";
  }
  if (/50\s*CL/.test(text)) return "petites-bouteilles";
  return "canettes";
}
