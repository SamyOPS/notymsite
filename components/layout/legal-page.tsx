import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { PageHero } from "./page-hero";

/**
 * Gabarit des pages légales : en-tête, date de mise à jour et colonne de
 * lecture. Les sections sont des <h2>, les sous-parties des <h3>.
 */
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: title }]}
        title={title}
        intro={
          <>
            {intro}
            <p className="mt-2 text-body text-ink-muted">
              Dernière mise à jour : {site.legal.updatedAt}
            </p>
          </>
        }
      />
      <div className="container-site border-t border-ink pt-10">
        <div className="max-w-3xl text-body [&_a]:text-teal-deep [&_a]:underline [&_a]:underline-offset-4 [&_dd]:mb-3 [&_dt]:font-semibold [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-h3 [&_h2:first-child]:mt-0 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-sans [&_h3]:text-body [&_h3]:font-semibold [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </>
  );
}
