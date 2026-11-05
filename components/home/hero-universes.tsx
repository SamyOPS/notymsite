import Link from "next/link";
import type { ReactNode } from "react";
import { DrinksIllustration } from "@/components/illustrations/drinks";
import { SaltyIllustration } from "@/components/illustrations/salty";
import { SweetIllustration } from "@/components/illustrations/sweet";
import { Trait } from "@/components/ui/trait";
import { cn } from "@/lib/cn";

/**
 * Hero plein écran en trois univers : Boissons (gauche, toute la hauteur),
 * Épicerie sucrée (haut droite), Épicerie salée (bas droite).
 * Chaque panneau est entièrement cliquable (lien étiré).
 */
export function HeroUniverses() {
  return (
    <section
      aria-labelledby="hero-titre"
      className="grid lg:h-[calc(100svh-4.5rem)] lg:min-h-[38rem] lg:grid-cols-2 lg:grid-rows-2"
    >
      <Panel
        className="min-h-[36rem] flex-col panel-teal lg:row-span-2 lg:min-h-0"
        illustration={<DrinksIllustration className="h-full w-full" />}
        illustrationClassName="min-h-60 origin-bottom"
      >
        <h1 id="hero-titre" className="max-w-xl text-h1">
          Vos boissons en gros, <Trait>livrées vite.</Trait>
        </h1>
        <p className="mt-6 max-w-md text-body-lg">
          Sodas, eaux, énergisants, jus et nectars. Livraison partout en France
          ou retrait au dépôt de Montataire (60).
        </p>
        <PanelLink href="/catalogue/boissons">Voir les boissons</PanelLink>
      </Panel>

      <Panel
        className="min-h-[24rem] flex-col panel-wheat sm:flex-row lg:min-h-0"
        textClassName="sm:w-[44%]"
        illustration={<SweetIllustration className="h-full w-full" />}
        illustrationClassName="min-h-44 origin-bottom-right"
      >
        <h2 className="text-h1">Épicerie sucrée</h2>
        <PanelLink href="/catalogue/epicerie-sucree">
          Voir l&apos;épicerie sucrée
        </PanelLink>
      </Panel>

      <Panel
        className="min-h-[24rem] flex-col panel-ink sm:flex-row lg:min-h-0"
        textClassName="sm:w-[44%]"
        illustration={<SaltyIllustration className="h-full w-full" />}
        illustrationClassName="min-h-44 origin-bottom-right"
      >
        <h2 className="text-h1">Épicerie salée</h2>
        <PanelLink href="/catalogue/epicerie-salee">
          Voir l&apos;épicerie salée
        </PanelLink>
      </Panel>
    </section>
  );
}

function Panel({
  className,
  textClassName,
  illustration,
  illustrationClassName,
  children,
}: {
  className: string;
  textClassName?: string;
  illustration: ReactNode;
  illustrationClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      <div
        className={cn(
          "flex shrink-0 flex-col items-start p-6 sm:p-10 lg:p-12",
          textClassName,
        )}
      >
        {children}
      </div>
      {/* L'illustration occupe l'espace restant, calée en bas. */}
      <div
        className={cn(
          "relative flex-1 transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.02]",
          illustrationClassName,
        )}
      >
        <div className="absolute inset-x-6 top-0 bottom-0 sm:right-10 sm:left-0 lg:right-12">
          {illustration}
        </div>
      </div>
    </div>
  );
}

/**
 * Bouton pilule aux couleurs du panneau (variables --panel-cta-*), dont la
 * zone cliquable couvre tout le panneau, illustration comprise.
 */
function PanelLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="mt-8 inline-flex min-h-13 items-center rounded-pill bg-[var(--panel-cta-bg)] px-7 text-body-lg font-semibold whitespace-nowrap text-[var(--panel-cta-fg)] transition-opacity after:absolute after:inset-0 after:z-10 hover:opacity-85"
    >
      {children}
    </Link>
  );
}
