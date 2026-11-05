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
    phoneInternational: "+33766980911",
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
  /**
   * Engagements repris tels quels du site actuel (notym.fr/service et
   * /devenir-client, consultés le 04/11/2026). À confirmer avant mise en ligne.
   */
  claims: {
    references: "Plus de 400 références",
    deliveryTime: "Livraison en 48 h en France métropolitaine",
    responseTime: "Réponse sous 48 h",
  },
  /** Informations légales reprises des mentions légales du site actuel. */
  /**
   * Informations légales. Sources : registre national des entreprises
   * (recherche-entreprises.api.gouv.fr, consulté le 05/11/2026) pour la forme,
   * le SIREN/SIRET, l'APE, la date de création et le dirigeant ; mentions
   * légales du site actuel pour le capital ; vercel.com pour l'hébergeur.
   */
  legal: {
    companyName: "NOTYM",
    legalForm: "SAS (société par actions simplifiée)",
    capital: "1 000,00 €",
    siren: "980 484 190",
    siret: "980 484 190 00023",
    vatNumber: "FR41 980 484 190",
    ape: "46.34Z — Commerce de gros de boissons",
    creationDate: "10 octobre 2023",
    /** Ville du greffe (format « RCS Ville 980 484 190 ») : à reprendre du Kbis. */
    rcsCity: null as string | null,
    publicationDirector: "M. Adil Samir Khizar, Président",
    host: {
      name: "Vercel Inc.",
      address: "440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis",
      website: "https://vercel.com",
    },
    /** Date de dernière mise à jour des pages légales. */
    updatedAt: "5 novembre 2026",
  },
  /**
   * Fonctionnalités activables. Prix masqués pour l'instant : le site
   * présente les produits, les prix figurent uniquement sur les devis.
   * Passer à true pour afficher les prix « à partir de » une fois saisis.
   */
  features: {
    showPrices: false as boolean,
  },
  /** URLs des réseaux sociaux : à fournir. Les icônes restent masquées tant que la liste est vide. */
  social: [] as ReadonlyArray<{ label: string; href: string }>,
} as const;

export const mainNav = [
  { label: "Accueil", href: "/" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Nos services", href: "/services" },
  { label: "Actualités", href: "/actualites" },
  { label: "Devenir client", href: "/devenir-client" },
] as const;

export const legalNav = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Conditions générales de vente", href: "/cgv" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
] as const;
