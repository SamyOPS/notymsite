/**
 * Informations réelles de l'entreprise, utilisées dans le header, le footer,
 * les pages légales et les données structurées (LocalBusiness).
 */
export const site = {
  name: "Notym",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.notym.fr").replace(
    /\/$/,
    "",
  ),
  tagline: "Grossiste boissons et snacks pour les professionnels",
  description:
    "Vente en gros de boissons et de snacks pour épiceries, cafés, restaurants et grandes surfaces. Livraison partout en France, retrait possible au dépôt de Montataire (60).",
  locale: "fr_FR",
  contact: {
    streetAddress: "4 Avenue de la Libération",
    postalCode: "60160",
    city: "Montataire",
    region: "Hauts-de-France",
    country: "FR",
    phone: "07 66 98 09 11",
    phoneHref: "tel:+33766980911",
    email: "achat@notym.fr",
  },
  hours: {
    label: "Lun — Sam : 9h30 à 17h30",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:30",
    closes: "17:30",
  },
  delivery: {
    shipping: "Livraison partout en France",
    pickup: "Retrait possible au dépôt de Montataire",
  },
  /** URLs des réseaux sociaux : à fournir. Les icônes restent masquées tant que la liste est vide. */
  social: [] as ReadonlyArray<{ label: string; href: string }>,
} as const;
