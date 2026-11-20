import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { site } from "@/lib/site";
import { QuoteFlow } from "./quote-flow";

export const metadata: Metadata = {
  title: "Mon devis",
  description:
    "Votre sélection de produits Notym et l'envoi de votre demande de devis.",
  robots: { index: false, follow: true },
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Mon devis" }]}
        title="Mon devis"
        intro={
          <p>
            Ajustez vos quantités, indiquez vos coordonnées et envoyez votre
            demande : notre équipe vous répond avec un devis.
          </p>
        }
      />
      {/* Plus d'air avant le pied de page, comme sur « Devenir client ». */}
      <div className="container-site pb-12 lg:pb-20">
        <QuoteFlow />
        <noscript>
          <p className="border-2 border-danger bg-surface-raised p-5 text-body">
            Votre sélection est enregistrée dans votre navigateur et nécessite
            JavaScript. Vous pouvez aussi nous appeler au {site.contact.phone}{" "}
            ou écrire à {site.contact.email}.
          </p>
        </noscript>
      </div>
    </>
  );
}
