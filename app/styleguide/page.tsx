import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FilterGroup } from "@/components/shop/filter-group";
import { ProductCard } from "@/components/shop/product-card";
import { ProductGrid } from "@/components/shop/product-grid";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button, ButtonLink } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { Pagination } from "@/components/ui/pagination";
import { PillRadioGroup } from "@/components/ui/pill-radio-group";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { SectionHeader } from "@/components/ui/section-header";
import { Select } from "@/components/ui/select";
import { Steps } from "@/components/ui/steps";
import { Textarea } from "@/components/ui/textarea";
import { Trait } from "@/components/ui/trait";
import { cn } from "@/lib/cn";
import { establishmentTypes } from "@/lib/validation/fields";
import type { ProductCardData } from "@/types/catalog";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const swatches = [
  { token: "surface", className: "bg-surface text-ink", usage: "Fond de page" },
  {
    token: "surface-raised",
    className: "bg-surface-raised text-ink",
    usage: "Cartes produit",
  },
  { token: "surface-inverse", className: "surface-inverse", usage: "Hero" },
  { token: "line", className: "bg-line text-ink", usage: "Filets" },
  {
    token: "ink",
    className: "bg-ink text-surface",
    usage: "Texte, filets forts",
  },
  {
    token: "ink-muted",
    className: "bg-ink-muted text-surface",
    usage: "Texte secondaire",
  },
  { token: "teal", className: "surface-teal", usage: "Bandeau pro" },
  {
    token: "teal-deep",
    className: "bg-teal-deep text-on-teal",
    usage: "Action principale",
  },
  {
    token: "teal-soft",
    className: "surface-teal-soft",
    usage: "Visuels produit",
  },
  { token: "wheat", className: "surface-wheat", usage: "Compteur du devis" },
  { token: "success", className: "bg-success text-surface", usage: "En stock" },
  {
    token: "danger",
    className: "bg-danger text-surface",
    usage: "Erreurs, rupture",
  },
];

const typeScale = [
  {
    name: "display",
    className: "font-display text-display",
    sample: "Vos boissons en gros",
  },
  { name: "h1", className: "font-display text-h1", sample: "Catalogue" },
  { name: "h2", className: "font-display text-h2", sample: "Produits phares" },
  { name: "h3", className: "font-display text-h3", sample: "Sodas & Eaux" },
  {
    name: "body-lg",
    className: "text-body-lg",
    sample: "Livraison partout en France, retrait au dépôt.",
  },
  { name: "body", className: "text-body", sample: "Pack de 24 · 33 cl" },
  { name: "label", className: "text-label", sample: "Type d'établissement" },
  {
    name: "caption",
    className: "text-caption text-ink-muted",
    sample: "Visuel à venir",
  },
];

/** Données FICTIVES de démonstration. */
const demo = (
  id: string,
  name: string,
  overrides: Partial<ProductCardData> = {},
): ProductCardData => ({
  id,
  slug: id,
  name,
  brand: "Marque fictive",
  packLabel: "Pack de 24",
  volume: "33 cl",
  imageUrl: null,
  badges: [],
  inStock: null,
  priceFromHtCents: null,
  ...overrides,
});

const demoProducts = [
  demo("demo-1", "Produit de démonstration A"),
  demo("demo-2", "Produit de démonstration B", { badges: ["new"] }),
  demo("demo-3", "Produit de démonstration C au nom plus long", {
    volume: "1,5 L",
  }),
  demo("demo-4", "Produit de démonstration D", { inStock: false }),
];

export default function StyleguidePage() {
  return (
    <main className="container-site py-12">
      <header className="mb-16 flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-8">
        <div className="max-w-3xl">
          <h1 className="text-h1">Styleguide</h1>
          <p className="mt-4 text-body-lg text-ink-muted">
            Bords carrés, filets plutôt qu&apos;ombres, pilules réservées aux
            boutons. Page interne, non indexée. Données fictives.
          </p>
        </div>
        <Logo eager className="w-32" />
      </header>

      <Section id="couleurs" title="Couleurs">
        <ul className="grid grid-cols-2 border-t border-l border-line sm:grid-cols-3 lg:grid-cols-4">
          {swatches.map((s) => (
            <li key={s.token} className="border-r border-b border-line">
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
        <ul className="divide-y divide-line border-y border-line">
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

      <Section id="boutons" title="Boutons">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primaire</Button>
            <Button variant="secondary">Secondaire</Button>
            <Button variant="dark">Dark</Button>
            <Button disabled>Désactivé</Button>
            <ButtonLink href="/styleguide#boutons">Lien bouton</ButtonLink>
          </div>
          <div className="flex flex-wrap items-center gap-3 surface-inverse p-8">
            <Button size="lg">Voir le catalogue</Button>
            <Button size="lg" variant="secondary">
              Devenir client
            </Button>
            <Button size="lg" variant="inverse">
              Inverse
            </Button>
          </div>
        </div>
      </Section>

      <Section id="badges" title="Étiquettes">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="best-seller" />
          <Badge variant="promo" />
          <Badge variant="in-stock" />
          <Badge variant="new" />
          <Badge variant="out-of-stock" />
        </div>
      </Section>

      <Section id="produits" title="Grille produits">
        <ProductGrid>
          {demoProducts.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ProductGrid>
      </Section>

      <Section id="formulaires" title="Champs">
        <form className="grid max-w-3xl gap-6 sm:grid-cols-2" action="#">
          <PillRadioGroup
            className="sm:col-span-2"
            legend="Type d'établissement"
            name="type"
            options={establishmentTypes}
            defaultValue="epicerie"
            required
          />
          <Input label="Raison sociale" name="company" required />
          <Input
            label="SIRET"
            name="siret"
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
          />
          <Checkbox name="rgpd" className="sm:col-span-2">
            J&apos;accepte que mes données soient utilisées pour traiter ma
            demande.
          </Checkbox>
          <QuantityStepper label="Quantité de démonstration" defaultValue={2} />
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
        </form>
      </Section>

      <Section id="navigation" title="Navigation">
        <div className="flex flex-col gap-10">
          <Breadcrumb
            items={[
              { label: "Accueil", href: "/" },
              { label: "Catalogue", href: "/styleguide" },
              { label: "Sodas & Eaux" },
            ]}
          />
          <Steps
            label="Étapes"
            steps={["Sélection", "Coordonnées", "Envoi"]}
            current={1}
          />
          <Pagination page={6} totalPages={12} pathname="/styleguide" />
          <SectionHeader
            title="Produits phares"
            href="/styleguide"
            linkLabel="Tout le catalogue"
          />
        </div>
      </Section>

      <Section id="trait" title="Motif de marque">
        <div className="surface-inverse p-8">
          <p className="font-display text-display">
            Vos boissons en gros, <Trait>livrées vite.</Trait>
          </p>
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
    <section id={id} className="mb-20 scroll-mt-8" aria-labelledby={`sg-${id}`}>
      <h2 id={`sg-${id}`} className="mb-6 text-h2">
        {title}
      </h2>
      {children}
    </section>
  );
}
