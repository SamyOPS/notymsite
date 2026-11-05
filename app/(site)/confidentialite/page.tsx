import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Notym collecte, utilise et protège les données envoyées depuis son site.",
  alternates: { canonical: "/confidentialite" },
};

export default function PrivacyPage() {
  const { legal, contact } = site;
  const mail = <a href={`mailto:${contact.email}`}>{contact.email}</a>;

  return (
    <LegalPage
      title="Politique de confidentialité"
      intro={
        <p>
          Cette politique explique quelles données {legal.companyName} collecte
          via son site, pourquoi, combien de temps elles sont conservées et
          comment exercer vos droits, conformément au Règlement général sur la
          protection des données (RGPD) et à la loi Informatique et Libertés.
        </p>
      }
    >
      <h2>1. Responsable du traitement</h2>
      <p>
        {legal.companyName}, {legal.legalForm}, {contact.streetAddress},{" "}
        {contact.postalCode} {contact.city}, SIREN {legal.siren}. Pour toute
        question relative à vos données : {mail} ou par courrier à
        l&apos;adresse du siège.
      </p>

      <h2>2. Données collectées</h2>
      <h3>Demandes de devis et de contact</h3>
      <p>Lorsque vous envoyez une demande depuis le site, nous recevons :</p>
      <ul>
        <li>
          le type de demande, le type d&apos;établissement et le mode de
          réception ;
        </li>
        <li>la raison sociale et le numéro SIRET ;</li>
        <li>
          le nom du contact, son téléphone et son adresse e-mail professionnelle
          ;
        </li>
        <li>l&apos;adresse de livraison ;</li>
        <li>
          votre message, le code remise éventuel et, pour un devis, les produits
          et quantités sélectionnés.
        </li>
      </ul>
      <p>
        Les champs marqués d&apos;un astérisque sont nécessaires au traitement
        de votre demande. Nous recevons également les informations que vous nous
        communiquez par téléphone ou par e-mail.
      </p>
      <h3>Données techniques</h3>
      <p>
        L&apos;hébergeur du site enregistre des données de connexion (adresse
        IP, type de navigateur, pages demandées, date et heure) dans ses
        journaux, pour assurer le fonctionnement et la sécurité du site.
      </p>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li>
          <strong>
            Traiter vos demandes de devis et de contact et vous répondre
          </strong>{" "}
          : mesures précontractuelles prises à votre demande (article 6.1.b du
          RGPD).
        </li>
        <li>
          <strong>Gérer la relation commerciale</strong> (commandes, livraisons,
          facturation, réclamations) : exécution du contrat (article 6.1.b) et
          respect de nos obligations légales, notamment comptables (article
          6.1.c).
        </li>
        <li>
          <strong>Vous informer de nos offres professionnelles</strong> :
          intérêt légitime (article 6.1.f). Vous pouvez vous y opposer à tout
          moment, gratuitement.
        </li>
        <li>
          <strong>Assurer la sécurité du site</strong> : intérêt légitime
          (article 6.1.f).
        </li>
      </ul>
      <p>{legal.companyName} ne vend ni ne loue vos données.</p>

      <h2>4. Durées de conservation</h2>
      <ul>
        <li>
          Demandes non suivies de commande : 3 ans à compter du dernier contact
          de votre part.
        </li>
        <li>Clients : pendant toute la relation commerciale, puis 3 ans.</li>
        <li>
          Pièces comptables (devis acceptés, factures) : 10 ans, conformément à
          l&apos;article L.123-22 du Code de commerce.
        </li>
        <li>Journaux de connexion : 12 mois au maximum.</li>
      </ul>

      <h2>5. Destinataires</h2>
      <p>Vos données sont accessibles uniquement :</p>
      <ul>
        <li>
          aux personnes habilitées de {legal.companyName} (service commercial,
          logistique, comptabilité) ;
        </li>
        <li>
          aux prestataires techniques qui agissent pour notre compte :
          l&apos;hébergeur {legal.host.name} et, le cas échéant, notre
          prestataire d&apos;envoi d&apos;e-mails ;
        </li>
        <li>
          aux transporteurs, pour les seules informations nécessaires à la
          livraison.
        </li>
      </ul>

      <h2>6. Transferts hors de l&apos;Union européenne</h2>
      <p>
        Notre hébergeur, {legal.host.name}, est établi aux États-Unis. Les
        transferts de données correspondants sont encadrés par le cadre de
        protection des données UE–États-Unis (EU-U.S. Data Privacy Framework),
        auquel {legal.host.name} a adhéré, et par des clauses contractuelles
        types de la Commission européenne.
      </p>

      <h2>7. Sécurité</h2>
      <p>
        Le site est servi exclusivement en HTTPS. L&apos;accès aux données est
        réservé aux personnes qui en ont besoin pour traiter vos demandes.
      </p>

      <h2>8. Vos droits</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification,
        d&apos;effacement, de limitation du traitement, de portabilité et
        d&apos;opposition, notamment à la prospection commerciale, ainsi que du
        droit de définir des directives relatives au sort de vos données après
        votre décès.
      </p>
      <p>
        Pour les exercer, écrivez à {mail} ou par courrier à l&apos;adresse du
        siège. Nous vous répondons dans un délai d&apos;un mois. En cas de doute
        raisonnable sur votre identité, un justificatif pourra vous être
        demandé.
      </p>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez
        adresser une réclamation à la CNIL :{" "}
        <a href="https://www.cnil.fr" rel="noopener noreferrer">
          www.cnil.fr
        </a>
        .
      </p>

      <h2>9. Cookies et stockage local</h2>
      <p>
        Le site n&apos;utilise ni cookie de mesure d&apos;audience, ni cookie
        publicitaire.
      </p>
      <p>
        Votre sélection de produits pour un devis est enregistrée uniquement
        dans votre navigateur (stockage local), sous la forme
        d&apos;identifiants de produits et de quantités. Ce stockage est
        strictement nécessaire au service que vous demandez et ne requiert donc
        pas de consentement. Il ne nous est transmis que si vous envoyez une
        demande de devis. Vous pouvez l&apos;effacer à tout moment depuis les
        réglages de votre navigateur.
      </p>

      <h2>10. Modification de la politique</h2>
      <p>
        Cette politique peut être mise à jour. La date de dernière mise à jour
        figure en haut de cette page.
      </p>
    </LegalPage>
  );
}
