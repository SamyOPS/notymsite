import type { Metadata } from "next";
import { LegalPage, Placeholder } from "@/components/layout/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description:
    "Conditions générales de vente de Notym, grossiste en boissons et snacks.",
  alternates: { canonical: "/cgv" },
};

/**
 * Gabarit : les clauses sont à rédiger par Notym (ou son conseil juridique).
 * Le site fonctionne sur demande de devis, sans paiement en ligne.
 */
const sections: Array<{ title: string; todo: string }> = [
  {
    title: "1. Objet",
    todo: "champ d'application des CGV (clients professionnels)",
  },
  {
    title: "2. Demandes de devis",
    todo: "valeur de la demande envoyée depuis le site et durée de validité des devis",
  },
  {
    title: "3. Commande",
    todo: "conditions de formation de la commande après acceptation du devis",
  },
  {
    title: "4. Produits",
    todo: "présentation des produits, disponibilité, conditionnements, photos non contractuelles",
  },
  {
    title: "5. Prix",
    todo: "prix indicatifs « à partir de » exprimés HT, TVA, tarifs dégressifs, frais de livraison",
  },
  {
    title: "6. Paiement",
    todo: "moyens et délais de paiement, pénalités de retard",
  },
  {
    title: "7. Livraison et retrait",
    todo: "zones et délais de livraison, retrait au dépôt de Montataire, transfert des risques",
  },
  {
    title: "8. Réception et réclamations",
    todo: "contrôle à réception, délai et forme des réclamations",
  },
  {
    title: "9. Responsabilité",
    todo: "limites de responsabilité, force majeure",
  },
  {
    title: "10. Droit applicable et litiges",
    todo: "droit applicable et juridiction compétente",
  },
];

export default function TermsPage() {
  return (
    <LegalPage title="Conditions générales de vente">
      <p>
        Les présentes conditions s&apos;appliquent aux ventes conclues entre{" "}
        {site.legal.companyName} ({site.legal.legalForm}, SIREN{" "}
        {site.legal.siren}) et ses clients professionnels.
      </p>
      {sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>
            <Placeholder>{section.todo}</Placeholder>
          </p>
        </section>
      ))}
    </LegalPage>
  );
}
