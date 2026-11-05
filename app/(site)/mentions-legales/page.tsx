import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site Notym : éditeur, hébergeur et informations juridiques.",
  alternates: { canonical: "/mentions-legales" },
};

export default function LegalNoticePage() {
  const { legal, contact } = site;
  const rcs = legal.rcsCity
    ? `RCS ${legal.rcsCity} ${legal.siren}`
    : `Immatriculée au Registre du commerce et des sociétés sous le numéro ${legal.siren}`;

  return (
    <LegalPage
      title="Mentions légales"
      intro={
        <p>
          Conformément à l&apos;article 6 de la loi n° 2004-575 du 21 juin 2004
          pour la confiance dans l&apos;économie numérique (LCEN), voici les
          informations relatives à l&apos;éditeur et à l&apos;hébergeur du site.
        </p>
      }
    >
      <h2>1. Éditeur du site</h2>
      <dl>
        <dt>Raison sociale</dt>
        <dd>{legal.companyName}</dd>
        <dt>Forme juridique</dt>
        <dd>
          {legal.legalForm} au capital de {legal.capital}
        </dd>
        <dt>Siège social</dt>
        <dd>
          {contact.streetAddress}, {contact.postalCode} {contact.city}, France
        </dd>
        <dt>Immatriculation</dt>
        <dd>{rcs}</dd>
        <dt>SIRET (siège)</dt>
        <dd>{legal.siret}</dd>
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

      <h2>2. Directeur de la publication</h2>
      <p>{legal.publicationDirector}.</p>

      <h2>3. Hébergement</h2>
      <p>
        Le site est hébergé par {legal.host.name}, {legal.host.address} (
        <a href={legal.host.website} rel="noopener noreferrer">
          {legal.host.website.replace("https://", "")}
        </a>
        ).
      </p>

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des éléments du site (textes, logo, illustrations,
        charte graphique, structure) est la propriété exclusive de{" "}
        {legal.companyName}, sauf mention contraire. Toute reproduction,
        représentation, modification ou adaptation, totale ou partielle, sans
        l&apos;autorisation écrite préalable de {legal.companyName} est
        interdite et constitue une contrefaçon sanctionnée par les articles
        L.335-2 et suivants du Code de la propriété intellectuelle.
      </p>
      <p>
        Les marques, logos et dénominations des produits présentés appartiennent
        à leurs titulaires respectifs. Ils ne sont cités que pour identifier les
        produits distribués par {legal.companyName}.
      </p>

      <h2>5. Responsabilité</h2>
      <p>
        {legal.companyName} veille à l&apos;exactitude des informations
        publiées. Les informations relatives aux produits (désignation,
        conditionnement, visuels) sont données à titre indicatif et ne
        constituent pas une offre contractuelle : seul le devis accepté engage
        les parties, dans les conditions prévues par nos{" "}
        <Link href="/cgv">conditions générales de vente</Link>.
      </p>
      <p>
        {legal.companyName} ne saurait être tenue responsable des interruptions
        du site, de l&apos;indisponibilité temporaire de certaines informations
        ni des dommages résultant d&apos;une utilisation du site non conforme à
        sa destination.
      </p>

      <h2>6. Liens hypertextes</h2>
      <p>
        Le site peut contenir des liens vers des sites tiers.{" "}
        {legal.companyName} n&apos;exerce aucun contrôle sur leur contenu et
        décline toute responsabilité à leur égard.
      </p>

      <h2>7. Données personnelles et cookies</h2>
      <p>
        Le traitement des données personnelles et l&apos;usage du stockage local
        sont décrits dans notre{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>. Le
        site n&apos;utilise ni cookie de mesure d&apos;audience, ni cookie
        publicitaire.
      </p>

      <h2>8. Droit applicable</h2>
      <p>
        Les présentes mentions légales sont régies par le droit français. Tout
        litige relatif au site relève de la compétence des juridictions
        françaises.
      </p>
    </LegalPage>
  );
}
