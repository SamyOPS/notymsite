import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Structure commune des pages publiques : lien d'évitement, header, contenu, footer. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenu"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-surface focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Aller au contenu
      </a>
      <SiteHeader />
      <main
        id="contenu"
        tabIndex={-1}
        // 80px avant le footer, sauf si la page finit par un bandeau pleine largeur.
        className="flex-1 pb-20 focus:outline-none has-[>[data-flush-bottom]:last-child]:pb-0"
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
