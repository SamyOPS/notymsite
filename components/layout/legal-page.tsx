import type { ReactNode } from "react";
import { PageHero } from "./page-hero";

/** Gabarit des pages légales : en-tête teal-soft et contenu en colonne de lecture. */
export function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: title }]}
        title={title}
        intro={
          <p className="text-body text-ink-muted">
            Dernière mise à jour :{" "}
            {updatedAt ?? <Placeholder>date</Placeholder>}
          </p>
        }
      />
      <div className="container-site py-16">
        <div className="max-w-3xl text-body [&_a]:text-teal-deep [&_a]:underline [&_a]:underline-offset-4 [&_dd]:mb-3 [&_dt]:font-semibold [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-h3 [&_h2:first-child]:mt-0 [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </>
  );
}

/** Information à fournir par Notym, bien visible tant qu'elle manque. */
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <mark className="bg-wheat-soft px-1.5 py-0.5 font-semibold text-wheat-ink">
      [À compléter : {children}]
    </mark>
  );
}
