import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Trait } from "@/components/ui/trait";
import { getCatalogOverview } from "@/lib/catalog/queries";
import { site } from "@/lib/site";
import boissons from "@/public/hero/boissons.webp";

const formatter = new Intl.NumberFormat("fr-FR");
/** « 1 690 » avec une espace insécable lisible (l'espace fine de fr-FR est trop étroite dans nos polices). */
const formatNumber = (n: number) => formatter.format(n).replace(/ /g, " ");

/**
 * Hero de l'accueil, « recherche d'abord » : titre, recherche dans tout le
 * catalogue (produit, marque ou référence), devis, puis les univers en
 * raccourcis et les engagements. Chiffres lus dans le catalogue.
 */
export async function Hero() {
  const { productCount, brandCount, universes } = await getCatalogOverview();
  const references = `${formatNumber(productCount)} références`;

  const promises = [
    {
      title: references,
      text: `${formatNumber(brandCount)} marques en boissons, épicerie, surgelés et hygiène.`,
    },
    {
      title: site.claims.delivery.title,
      text: `${site.claims.delivery.area}.`,
    },
    {
      title: "Retrait au dépôt",
      text: `${site.contact.city} (${site.contact.postalCode.slice(0, 2)}), ${site.hours.label}.`,
    },
    {
      title: "Devis gratuit",
      text: `${site.claims.responseTime}, sans engagement.`,
    },
  ];

  return (
    <section aria-labelledby="hero-titre">
      {/* grid-cols-1 : la colonne peut se réduire (sinon la recherche l'élargit au-delà de l'écran). */}
      <div className="container-site grid grid-cols-1 gap-10 pt-8 pb-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pt-12 lg:pb-16">
        <div className="flex flex-col items-start">
          <h1 id="hero-titre" className="max-w-2xl text-display">
            Vos boissons et votre épicerie en gros, <Trait>livrées vite.</Trait>
          </h1>
          <p className="mt-6 max-w-xl text-body-lg text-ink-muted">
            {references} pour épiceries, cafés, restaurants et grandes surfaces.
            Livraison partout en France ou retrait au dépôt de{" "}
            {site.contact.city}.
          </p>

          <form
            role="search"
            action="/catalogue"
            method="get"
            className="mt-8 flex w-full max-w-xl items-stretch rounded-pill border-2 border-ink bg-surface-raised focus-within:border-teal-deep"
          >
            <label htmlFor="hero-recherche" className="sr-only">
              Rechercher un produit, une marque ou une référence
            </label>
            <Search
              aria-hidden
              className="ml-5 hidden size-5 shrink-0 self-center text-ink-muted sm:block"
            />
            <input
              id="hero-recherche"
              type="search"
              name="q"
              placeholder="Produit, marque ou référence…"
              autoComplete="off"
              className="h-14 min-w-0 flex-1 bg-transparent px-5 text-body text-ink placeholder:text-ink-muted focus-visible:outline-none sm:px-3 sm:text-body-lg"
            />
            {/* Sur mobile, une loupe seule : le champ garde sa place. */}
            <button
              type="submit"
              className="m-1.5 inline-flex items-center justify-center rounded-pill bg-ink px-3.5 text-body font-semibold text-surface transition-colors hover:bg-ink-hover sm:px-5"
            >
              <Search aria-hidden className="size-5 sm:hidden" />
              <span className="max-sm:sr-only">Rechercher</span>
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href="/devenir-client" size="lg">
              Demander un devis
            </ButtonLink>
            <Link
              href="/catalogue"
              className="inline-flex min-h-11 items-center gap-2 text-body-lg font-semibold underline underline-offset-4 hover:text-accent-text"
            >
              Parcourir le catalogue
              <ArrowRight aria-hidden className="size-5" />
            </Link>
          </div>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden bg-teal-soft lg:aspect-[4/5] lg:max-h-[38rem]">
          {/* Photo décorative : le texte porte le sens. */}
          <Image
            src={boissons}
            alt=""
            fill
            preload
            placeholder="blur"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <nav aria-labelledby="univers-titre" className="container-site">
        <h2 id="univers-titre" className="sr-only">
          Nos univers
        </h2>
        <ul className="grid grid-cols-2 gap-px border-y border-ink bg-line sm:grid-cols-3 lg:grid-cols-5">
          {universes.map((universe) => (
            <li key={universe.slug}>
              <UniverseLink
                href={`/catalogue/${universe.slug}`}
                name={universe.name}
                count={universe.count}
              />
            </li>
          ))}
          <li>
            <UniverseLink
              href="/catalogue"
              name="Tout le catalogue"
              count={productCount}
              strong
            />
          </li>
        </ul>
      </nav>

      <ul className="container-site grid gap-x-10 gap-y-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {promises.map((item) => (
          <li key={item.title} className="flex flex-col gap-1">
            <p className="font-sans text-body font-semibold">{item.title}</p>
            <p className="text-body text-ink-muted">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function UniverseLink({
  href,
  name,
  count,
  strong,
}: {
  href: string;
  name: string;
  count: number;
  strong?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        strong
          ? "group flex h-full min-h-24 flex-col justify-between gap-2 bg-ink p-4 text-on-inverse transition-colors hover:bg-ink-hover sm:p-5"
          : "group flex h-full min-h-24 flex-col justify-between gap-2 bg-surface p-4 transition-colors hover:bg-teal-soft sm:p-5"
      }
    >
      <span className="font-display text-body-lg leading-tight font-bold">
        {name}
      </span>
      <span
        className={
          strong
            ? "flex items-center justify-between text-caption"
            : "flex items-center justify-between text-caption text-ink-muted"
        }
      >
        {formatNumber(count)} produit{count > 1 ? "s" : ""}
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
