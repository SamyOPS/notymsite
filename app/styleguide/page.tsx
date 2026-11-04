import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

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

export default function StyleguidePage() {
  return (
    <main className="container-site py-12">
      <header className="mb-12 max-w-3xl">
        <p className="text-label tracking-wider text-teal-deep uppercase">
          Notym · interne
        </p>
        <h1 className="mt-2 text-h1">Styleguide</h1>
        <p className="mt-4 text-body-lg text-ink-muted">
          Tokens, typographie et composants. Page non indexée. Les données
          affichées sont fictives.
        </p>
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
    <section className="mb-16" aria-labelledby={`sg-${id}`}>
      <h2 id={`sg-${id}`} className="mb-6 text-h2">
        {title}
      </h2>
      {children}
    </section>
  );
}
