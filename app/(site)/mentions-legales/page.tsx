import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Placeholder } from "@/components/layout/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site Notym : éditeur, hébergeur et informations juridiques.",
  alternates: { canonical: "/mentions-legales" },
};

export default function LegalNoticePage() {
  const { legal, contact } = site;
  return (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2>
      <dl>
        <dt>Raison sociale</dt>
        <dd>{legal.companyName}</dd>
        <dt>Forme juridique</dt>
        <dd>{legal.legalForm}</dd>
        <dt>Capital social</dt>
        <dd>{legal.capital}</dd>
        <dt>Siège social</dt>
        <dd>
          {contact.streetAddress}, {contact.postalCode} {contact.city}
        </dd>
        <dt>SIREN</dt>
        <dd>{legal.siren}</dd>
        <dt>SIRET</dt>
        <dd>{legal.siret}</dd>
        <dt>Immatriculation RCS</dt>
        <dd>
          {legal.rcs ?? (
            <Placeholder>ville du greffe et numéro RCS</Placeholder>
          )}
        </dd>
        <dt>TVA intracommunautaire</dt>
        <dd>{legal.vatNumber}</dd>
        <dt>Code APE</dt>
        <dd>{legal.ape}</dd>
        <dt>Contact</dt>
        <dd>
          <a href={contact.phoneHref}>{contact.phone}</a> ·{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </dd>
      </dl>

      <h2>Directeur de la publication</h2>
      <p>
        {legal.publicationDirector ?? (
          <Placeholder>
            nom et qualité du directeur de la publication
          </Placeholder>
        )}
      </p>

      <h2>Hébergement</h2>
      <p>
        {legal.host.name}, {legal.host.address}.{" "}
        <a href={legal.host.website} rel="noopener noreferrer">
          {legal.host.website.replace("https://", "")}
        </a>
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les contenus de ce site (textes, logo, visuels) appartiennent à{" "}
        {legal.companyName} ou à leurs titulaires respectifs. Les marques citées
        appartiennent à leurs propriétaires.
      </p>
      <p>
        <Placeholder>conditions de reproduction des contenus</Placeholder>
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans notre{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>Droit applicable</h2>
      <p>Le présent site est soumis au droit français.</p>
    </LegalPage>
  );
}
