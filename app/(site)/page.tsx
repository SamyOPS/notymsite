import {
  ArrowRight,
  BadgeCheck,
  Headset,
  PackageCheck,
  Phone,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { BrandMarquee } from "@/components/shop/brand-marquee";
import { CategoryCard } from "@/components/shop/category-card";
import { ProductCard } from "@/components/shop/product-card";
import { ButtonLink, buttonStyles } from "@/components/ui/button";
import { GrainCluster } from "@/components/ui/grain";
import { SectionHeader } from "@/components/ui/section-header";
import { Trait } from "@/components/ui/trait";
import {
  getBrands,
  getCategories,
  getFeaturedProducts,
  getProductCardBySlug,
} from "@/lib/catalog/queries";
import { localBusinessJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import type { ProductCardData } from "@/types/catalog";

export const metadata: Metadata = {
  title: { absolute: `${site.name} — ${site.tagline}` },
  description: site.description,
  alternates: { canonical: "/" },
};

/** Atouts repris du site actuel. */
const strengths: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: Truck,
    title: "Livraison rapide",
    text: "Partout en France, ou retrait au dépôt.",
  },
  {
    icon: PackageCheck,
    title: "Stock permanent",
    text: "Des produits toujours disponibles.",
  },
  {
    icon: BadgeCheck,
    title: "Grandes marques",
    text: "Les références les plus vendues.",
  },
  {
    icon: Headset,
    title: "Support pro",
    text: "Un service B2B dédié, du lundi au samedi.",
  },
];

export default async function HomePage() {
  const [categories, featured, brands, heroProduct] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
    getBrands(),
    getProductCardBySlug("red-bull-25-cl-x24"),
  ]);

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />

      {/* Hero */}
      <section
        aria-labelledby="hero-titre"
        className="overflow-hidden surface-inverse"
      >
        <div className="container-site grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-pill border border-current/25 px-4 py-1.5 text-label">
              <span
                aria-hidden
                className="size-2 rounded-pill bg-accent-fill"
              />
              Fournisseur B2B · Montataire (60)
            </p>
            <h1 id="hero-titre" className="mt-6 text-display">
              Vos boissons en gros, <Trait>livrées vite.</Trait>
            </h1>
            <p className="mt-8 max-w-xl text-body-lg">
              Sodas, eaux, énergisants, jus et snacks des grandes marques pour
              les épiceries, cafés, restaurants et grandes surfaces. Livraison
              partout en France ou retrait au dépôt.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/catalogue" size="lg">
                Voir le catalogue <ArrowRight aria-hidden />
              </ButtonLink>
              <ButtonLink href="/devenir-client" size="lg" variant="inverse">
                Devenir client
              </ButtonLink>
            </div>
          </div>
          {heroProduct && <HeroComposition product={heroProduct} />}
        </div>
      </section>

      {/* Atouts */}
      <section aria-labelledby="atouts-titre" className="border-b border-line">
        <h2 id="atouts-titre" className="sr-only">
          Nos atouts
        </h2>
        <ul className="container-site grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-teal-soft text-teal-deep">
                <Icon aria-hidden className="size-6" />
              </span>
              <div>
                <h3 className="font-sans text-body-lg font-semibold">
                  {title}
                </h3>
                <p className="text-body text-ink-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Catégories */}
      <section
        aria-labelledby="categories-titre"
        className="container-site py-20"
      >
        <SectionHeader
          eyebrow="Catalogue"
          title="Nos catégories de produits"
          titleId="categories-titre"
          href="/catalogue"
          linkLabel="Tout le catalogue"
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <li key={category.id}>
              <CategoryCard
                href={`/catalogue/${category.slug}`}
                title={category.name}
                subtitle={category.description}
                tone={category.tone}
                className="h-full"
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Produits phares */}
      <section aria-labelledby="phares-titre" className="container-site pb-20">
        <SectionHeader
          eyebrow="Sélection"
          title="Nos produits phares"
          titleId="phares-titre"
          href="/catalogue"
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>

      {/* Bandeau devenir client */}
      <section aria-labelledby="cta-titre" className="container-site pb-20">
        <div className="flex flex-col gap-8 rounded-lg surface-teal p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div className="max-w-2xl">
            <h2 id="cta-titre" className="text-h2">
              Vous êtes un professionnel ?
            </h2>
            <p className="mt-3 text-body-lg">
              Envoyez-nous votre demande : notre équipe vous recontacte avec un
              devis adapté à vos volumes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/devenir-client" size="lg" variant="dark">
              Devenir client
            </ButtonLink>
            <a
              href={site.contact.phoneHref}
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              <Phone aria-hidden /> {site.contact.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Marques */}
      <section
        aria-labelledby="marques-titre"
        className="border-t border-line bg-surface-raised py-20"
      >
        <div className="container-site">
          <SectionHeader
            eyebrow="Marques"
            title="Les marques disponibles"
            titleId="marques-titre"
          />
          <BrandMarquee brands={brands.map((b) => b.name)} className="mt-10" />
        </div>
      </section>
    </>
  );
}

/** Composition décorative du hero : bloc teal à grains, bloc wheat, carte produit inclinée. */
function HeroComposition({ product }: { product: ProductCardData }) {
  return (
    <div aria-hidden inert className="relative hidden h-115 lg:block">
      <div className="absolute top-0 right-0 h-85 w-[78%] overflow-hidden rounded-lg surface-teal">
        <GrainCluster preset="hero" />
      </div>
      <div className="absolute bottom-2 left-0 size-40 rounded-lg surface-wheat" />
      <div className="absolute bottom-0 left-[18%] w-64 -rotate-3">
        <ProductCard product={product} />
      </div>
    </div>
  );
}
