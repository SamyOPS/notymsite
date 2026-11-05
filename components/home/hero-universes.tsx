import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Trait } from "@/components/ui/trait";
import { cn } from "@/lib/cn";
import boissons from "@/public/hero/boissons.webp";
import sale from "@/public/hero/sale.webp";
import sucre from "@/public/hero/sucre.webp";

/**
 * Hero plein écran en trois univers : Boissons (gauche, toute la hauteur),
 * Épicerie sucrée (haut droite), Épicerie salée (bas droite).
 * Photos en plein cadre (crédits : lib/image-credits.ts), voile sombre pour
 * la lisibilité du texte, panneaux entièrement cliquables.
 */
export function HeroUniverses() {
  return (
    <section
      aria-labelledby="hero-titre"
      className="grid lg:h-[calc(100svh-4.5rem)] lg:min-h-[38rem] lg:grid-cols-2 lg:grid-rows-2"
    >
      <Panel
        image={boissons}
        preload
        className="min-h-[34rem] lg:row-span-2 lg:min-h-0"
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

      <Panel image={sucre} className="min-h-[20rem] lg:min-h-0">
        <h2 className="text-h1">Épicerie sucrée</h2>
        <PanelLink href="/catalogue/epicerie-sucree">
          Voir l&apos;épicerie sucrée
        </PanelLink>
      </Panel>

      <Panel image={sale} className="min-h-[20rem] lg:min-h-0">
        <h2 className="text-h1">Épicerie salée</h2>
        <PanelLink href="/catalogue/epicerie-salee">
          Voir l&apos;épicerie salée
        </PanelLink>
      </Panel>
    </section>
  );
}

function Panel({
  image,
  preload,
  className,
  children,
}: {
  image: StaticImageData;
  preload?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("group relative flex overflow-hidden panel-ink", className)}
    >
      {/* Photo décorative : le texte du panneau porte le sens. */}
      <Image
        src={image}
        alt=""
        fill
        preload={preload}
        placeholder="blur"
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
      />
      <div aria-hidden className="absolute inset-0 panel-shade" />
      <div className="relative flex flex-col items-start p-6 sm:p-10 lg:p-12">
        {children}
      </div>
    </div>
  );
}

/**
 * Bouton pilule aux couleurs du panneau (variables --panel-cta-*), dont la
 * zone cliquable couvre tout le panneau.
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
