import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Les actualités de Notym : nouveautés, arrivages et informations pratiques.",
  alternates: { canonical: "/actualites" },
};

/** Aucun article pour l'instant : la source des actualités sera branchée plus tard. */
export default function NewsPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Actualités" }]}
        title="Actualités"
        intro={<p>Nouveautés, arrivages et informations pratiques.</p>}
      />
      <div className="container-site">
        <EmptyState
          title="Aucune actualité pour le moment"
          description={
            <p>Revenez bientôt, ou consultez le catalogue en attendant.</p>
          }
          actions={<ButtonLink href="/catalogue">Voir le catalogue</ButtonLink>}
          className="py-20"
        />
      </div>
    </>
  );
}
