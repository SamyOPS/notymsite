import { ArrowRight, FileText } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CategoryCard } from "@/components/shop/category-card";
import { FilterGroup } from "@/components/shop/filter-group";
import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button, ButtonLink } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Grain, GrainCluster } from "@/components/ui/grain";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { Pagination } from "@/components/ui/pagination";
import { PillRadioGroup } from "@/components/ui/pill-radio-group";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { SectionHeader } from "@/components/ui/section-header";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trait } from "@/components/ui/trait";
import { cn } from "@/lib/cn";
import type { ProductCardData } from "@/types/catalog";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

type Swatch = { token: string; className: string; usage: string };

const swatches: Swatch[] = [
  { token: "surface", className: "bg-surface text-ink", usage: "Fond de page" },
  {
    token: "surface-raised",
    className: "bg-surface-raised text-ink",
    usage: "Cartes, menus",
  },
  {
    token: "surface-inverse",
    className: "surface-inverse",
    usage: "Hero, bandeaux, footer",
  },
  {
    token: "line",
    className: "bg-line text-ink",
    usage: "Filets, bordures de cartes",
  },
  {
    token: "line-strong",
    className: "bg-line-strong text-ink",
    usage: "Bordures de champs",
  },
  { token: "ink", className: "bg-ink text-surface", usage: "Texte principal" },
  {
    token: "ink-muted",
    className: "bg-ink-muted text-surface",
    usage: "Texte secondaire",
  },
  { token: "teal", className: "surface-teal", usage: "Aplats uniquement" },
  {
    token: "teal-deep",
    className: "bg-teal-deep text-on-teal",
    usage: "Boutons, liens, actif",
  },
  {
    token: "teal-soft",
    className: "surface-teal-soft",
    usage: "Fonds teintés, photos",
  },
  {
    token: "wheat",
    className: "surface-wheat",
    usage: "Best-sellers (1 zone / écran)",
  },
  {
    token: "wheat-soft",
    className: "bg-wheat-soft text-wheat-ink",
    usage: "Fond badge promo",
  },
  { token: "success", className: "bg-success text-surface", usage: "En stock" },
  {
    token: "danger",
    className: "bg-danger text-surface",
    usage: "Rupture, erreurs",
  },
];

const typeScale = [
  {
    name: "display",
    className: "font-display text-display",
    sample: "Vos boissons en gros",
  },
  {
    name: "h1",
    className: "font-display text-h1",
    sample: "Catalogue professionnel",
  },
  {
    name: "h2",
    className: "font-display text-h2",
    sample: "Nos produits phares",
  },
  { name: "h3", className: "font-display text-h3", sample: "Sodas & Eaux" },
  {
    name: "body-lg",
    className: "text-body-lg",
    sample: "Livraison partout en France, retrait au dépôt.",
  },
  {
    name: "body",
    className: "text-body",
    sample: "Pack de 24 canettes de 33 cl.",
  },
  { name: "label", className: "text-label", sample: "Type d'établissement" },
  {
    name: "caption",
    className: "text-caption text-ink-muted",
    sample: "Référence et conditionnement",
  },
  { name: "price", className: "text-price", sample: "0,00 € HT" },
];

/** Données FICTIVES de démonstration : aucun prix ni produit réel. */
const demoProducts: ProductCardData[] = [
  {
    id: "demo-1",
    slug: "produit-demo-1",
    name: "Produit de démonstration A",
    brand: "Marque fictive",
    packLabel: "Pack de 24 canettes",
    volume: "33 cl",
    imageUrl: null,
    badges: ["best-seller"],
    inStock: true,
    priceFromHtCents: 0,
  },
  {
    id: "demo-2",
    slug: "produit-demo-2",
    name: "Produit de démonstration B",
    brand: "Marque fictive",
    packLabel: "Pack de 6 bouteilles",
    volume: "1,5 L",
    imageUrl: null,
    badges: ["promo"],
    inStock: true,
    priceFromHtCents: null,
  },
  {
    id: "demo-3",
    slug: "produit-demo-3",
    name: "Produit de démonstration C au nom plus long",
    brand: "Marque fictive",
    packLabel: "Carton de 10 gourdes",
    volume: "20 cl",
    imageUrl: null,
    badges: ["new"],
    inStock: true,
    priceFromHtCents: null,
  },
  {
    id: "demo-4",
    slug: "produit-demo-4",
    name: "Produit de démonstration D",
    brand: "Marque fictive",
    packLabel: "Pack de 12 canettes",
    volume: "25 cl",
    imageUrl: null,
    badges: [],
    inStock: false,
    priceFromHtCents: null,
  },
];

const establishmentTypes = [
  { value: "epicerie", label: "Épicerie" },
  { value: "cafe-bar", label: "Café / Bar" },
  { value: "restaurant", label: "Restaurant" },
  { value: "grande-surface", label: "Grande surface" },
  { value: "autre", label: "Autre" },
] as const;

export default function StyleguidePage() {
  return (
    <main className="container-site py-12">
      <header className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <p className="text-label tracking-[0.08em] text-accent-text uppercase">
            Notym · interne
          </p>
          <h1 className="mt-2 text-h1">Styleguide</h1>
          <p className="mt-4 text-body-lg text-ink-muted">
            Tokens, typographie et composants. Page non indexée. Toutes les
            données affichées sont fictives.
          </p>
        </div>
        <Logo eager className="w-40" />
      </header>

      <Section id="couleurs" title="Couleurs">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {swatches.map((s) => (
            <li
              key={s.token}
              className="overflow-hidden rounded-md border border-line bg-surface-raised"
            >
              <div
                className={cn(
                  "flex h-20 items-end p-3 font-display text-h3",
                  s.className,
                )}
              >
                Aa
              </div>
              <div className="p-3">
                <p className="text-label">{s.token}</p>
                <p className="text-caption text-ink-muted">{s.usage}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="typographie" title="Typographie">
        <ul className="divide-y divide-line">
          {typeScale.map((t) => (
            <li
              key={t.name}
              className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr] sm:items-baseline"
            >
              <span className="text-caption text-ink-muted">{t.name}</span>
              <span className={t.className}>{t.sample}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="rayons-ombres" title="Rayons et ombres">
        <div className="flex flex-wrap gap-6">
          {[
            ["sm · 6px", "rounded-sm"],
            ["md · 12px", "rounded-md"],
            ["lg · 20px", "rounded-lg"],
            ["pill", "rounded-pill"],
          ].map(([label, radius]) => (
            <div
              key={label}
              className={cn(
                "flex h-20 w-32 items-center justify-center bg-teal-soft text-label",
                radius,
              )}
            >
              {label}
            </div>
          ))}
          <div className="flex h-20 w-40 items-center justify-center rounded-lg bg-surface-raised text-label shadow-card">
            shadow-card
          </div>
          <div className="flex h-20 w-40 items-center justify-center rounded-lg bg-surface-raised text-label shadow-lift">
            shadow-lift
          </div>
        </div>
      </Section>

      <Section id="boutons" title="Boutons">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primaire</Button>
            <Button variant="secondary">Secondaire</Button>
            <Button variant="dark">Dark</Button>
            <Button disabled>Désactivé</Button>
            <ButtonLink href="/styleguide#boutons" variant="primary">
              Lien bouton <ArrowRight aria-hidden />
            </ButtonLink>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg">Voir le catalogue</Button>
            <Button size="lg" variant="secondary">
              <FileText aria-hidden /> Demander un devis
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-lg surface-inverse p-6">
            <Button size="lg" variant="primary">
              Voir le catalogue
            </Button>
            <Button size="lg" variant="inverse">
              Devenir client
            </Button>
            <Button size="lg" variant="secondary">
              Secondaire sur fond sombre
            </Button>
          </div>
        </div>
      </Section>

      <Section id="badges" title="Badges">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="best-seller" />
          <Badge variant="promo" />
          <Badge variant="in-stock" />
          <Badge variant="new" />
          <Badge variant="out-of-stock" />
        </div>
      </Section>

      <Section id="cartes-produit" title="Cartes produit">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {demoProducts.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="cartes-categorie" title="Cartes catégorie">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <CategoryCard
              href="/styleguide#cartes-categorie"
              title="Sodas & Eaux"
              subtitle="Sous-titre de démonstration"
              tone="teal"
            />
          </li>
          <li>
            <CategoryCard
              href="/styleguide#cartes-categorie"
              title="Énergisants"
              subtitle="Sous-titre de démonstration"
              tone="ink"
            />
          </li>
          <li>
            <CategoryCard
              href="/styleguide#cartes-categorie"
              title="Jus & Nectars"
              subtitle="Sous-titre de démonstration"
              tone="wheat"
            />
          </li>
          <li>
            <CategoryCard
              href="/styleguide#cartes-categorie"
              title="Chips & Snacks"
              subtitle="Sous-titre de démonstration"
              tone="teal-soft"
            />
          </li>
        </ul>
      </Section>

      <Section id="formulaires" title="Champs de formulaire">
        <form className="grid max-w-3xl gap-6 sm:grid-cols-2" action="#">
          <PillRadioGroup
            className="sm:col-span-2"
            legend="Type d'établissement"
            name="type"
            options={establishmentTypes}
            defaultValue="epicerie"
            required
          />
          <Input
            label="Raison sociale"
            name="company"
            required
            autoComplete="organization"
          />
          <Input
            label="SIRET"
            name="siret"
            inputMode="numeric"
            hint="14 chiffres, sans espaces."
            required
          />
          <Input
            label="E-mail professionnel"
            name="email"
            type="email"
            defaultValue="adresse-invalide"
            error="Saisissez une adresse e-mail valide, par exemple nom@entreprise.fr."
            required
          />
          <Select label="Mode de réception" name="delivery" defaultValue="">
            <option value="" disabled>
              Choisissez une option
            </option>
            <option value="livraison">Livraison</option>
            <option value="retrait">Retrait au dépôt</option>
          </Select>
          <Textarea
            fieldClassName="sm:col-span-2"
            label="Votre besoin"
            name="message"
            placeholder="Références, volumes, fréquence de livraison…"
          />
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Checkbox name="rgpd" required>
              J&apos;accepte que mes données soient utilisées pour traiter ma
              demande.
            </Checkbox>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-label">Quantité</span>
            <QuantityStepper
              label="Quantité de démonstration"
              defaultValue={2}
            />
          </div>
        </form>
      </Section>

      <Section id="filtres" title="Filtres">
        <form method="get" action="/styleguide" className="max-w-xs">
          <FilterGroup
            legend="Marque"
            name="marque"
            selected={["marque-a"]}
            resetHref="/styleguide#filtres"
            options={[
              { value: "marque-a", label: "Marque A", count: 12 },
              { value: "marque-b", label: "Marque B", count: 4 },
              { value: "marque-c", label: "Marque C", count: 0 },
            ]}
          />
          <FilterGroup
            legend="Disponibilité"
            name="dispo"
            selected={[]}
            options={[{ value: "en-stock", label: "En stock", count: 21 }]}
          />
        </form>
      </Section>

      <Section id="navigation" title="Navigation">
        <div className="flex flex-col gap-8">
          <Breadcrumb
            items={[
              { label: "Accueil", href: "/" },
              { label: "Catalogue", href: "/styleguide" },
              { label: "Sodas & Eaux" },
            ]}
          />
          <Pagination
            page={6}
            totalPages={12}
            pathname="/styleguide"
            searchParams={{ marque: "marque-a" }}
          />
          <SectionHeader
            eyebrow="Sélection"
            title="Nos produits phares"
            href="/styleguide"
            description="Description courte de la section."
          />
        </div>
      </Section>

      <Section id="motifs" title="Motifs de marque">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg surface-inverse p-8">
            <p className="font-display text-display">
              Vos boissons en gros, <Trait>livrées vite.</Trait>
            </p>
          </div>
          <div className="relative min-h-64 overflow-hidden rounded-lg surface-teal">
            <GrainCluster preset="hero" />
          </div>
          <div className="relative min-h-64 overflow-hidden rounded-lg border border-line bg-surface-raised">
            <GrainCluster preset="empty" />
          </div>
          <div className="flex items-center justify-center gap-6 rounded-lg border border-line bg-surface-raised p-8">
            <Grain tone="teal" size="lg" angle={35} />
            <Grain tone="wheat" size="lg" angle={-35} />
            <Grain tone="ink" size="lg" angle={35} />
            <span className="rounded-md bg-teal p-3">
              <Grain tone="surface" size="lg" angle={-35} />
            </span>
          </div>
          <div className="flex items-center gap-6 rounded-lg surface-inverse p-8 lg:col-span-2">
            <Logo className="w-40" />
            <p className="text-body text-on-inverse">
              Logo sur fond sombre : pastille claire en attendant la version
              blanche.
            </p>
          </div>
        </div>
      </Section>
    </main>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-8" aria-labelledby={`sg-${id}`}>
      <h2 id={`sg-${id}`} className="mb-6 text-h2">
        {title}
      </h2>
      {children}
    </section>
  );
}
