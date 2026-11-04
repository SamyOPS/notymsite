import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <div className="container-site">
        <EmptyState
          headingLevel="h1"
          title="Page introuvable"
          description={<p>Cette page n&apos;existe pas ou a été déplacée.</p>}
          actions={
            <>
              <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
              <ButtonLink href="/catalogue" variant="secondary">
                Voir le catalogue
              </ButtonLink>
            </>
          }
          className="py-24"
        />
      </div>
    </SiteShell>
  );
}
