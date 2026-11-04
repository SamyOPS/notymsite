import type { Metadata } from "next";
import { LegalPage, Placeholder } from "@/components/layout/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Notym collecte et traite les données envoyées depuis son site.",
  alternates: { canonical: "/confidentialite" },
};

export default function PrivacyPage() {
  const { legal, contact } = site;
  return (
    <LegalPage title="Politique de confidentialité">
      <h2>Responsable du traitement</h2>
      <p>
        {legal.companyName}, {legal.legalForm}, {contact.streetAddress},{" "}
        {contact.postalCode} {contact.city}. Contact :{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>

      <h2>Données collectées</h2>
      <p>
        Lorsque vous envoyez une demande de devis ou de contact, nous recevons :
      </p>
      <ul>
        <li>le type de demande et le type d&apos;établissement ;</li>
        <li>la raison sociale et le numéro SIRET ;</li>
        <li>
          le nom du contact, son téléphone et son adresse e-mail professionnelle
          ;
        </li>
        <li>l&apos;adresse de livraison ;</li>
        <li>
          le message que vous rédigez et, le cas échéant, les produits
          sélectionnés.
        </li>
      </ul>

      <h2>Finalité</h2>
      <p>Ces données servent à traiter votre demande et à vous recontacter.</p>
      <p>
        Base légale :{" "}
        <Placeholder>
          base légale retenue (consentement, mesures précontractuelles…)
        </Placeholder>
      </p>

      <h2>Durée de conservation</h2>
      <p>
        <Placeholder>
          durée de conservation des demandes et des données clients
        </Placeholder>
      </p>

      <h2>Destinataires</h2>
      <p>
        <Placeholder>
          services internes destinataires et sous-traitants (hébergement, envoi
          d&apos;e-mails)
        </Placeholder>
      </p>

      <h2>Stockage local et cookies</h2>
      <p>
        La sélection de produits pour votre devis est enregistrée uniquement
        dans votre navigateur (stockage local). Elle ne nous est transmise que
        si vous envoyez une demande.
      </p>
      <p>
        Le site n&apos;utilise ni cookie de mesure d&apos;audience, ni cookie
        publicitaire.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
        rectification, d&apos;effacement, de limitation, de portabilité et
        d&apos;opposition. Pour les exercer, écrivez à{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
      <p>
        Vous pouvez aussi adresser une réclamation à la CNIL :{" "}
        <a href="https://www.cnil.fr" rel="noopener noreferrer">
          www.cnil.fr
        </a>
        .
      </p>
    </LegalPage>
  );
}
