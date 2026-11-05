import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description:
    "Conditions générales de vente de Notym, grossiste en boissons et épicerie pour les professionnels.",
  alternates: { canonical: "/cgv" },
};

/**
 * CGV entre professionnels, vente sur devis, sans paiement en ligne.
 * Les paramètres commerciaux non arrêtés (délai de paiement, frais et délais
 * de livraison, minimum de commande) sont renvoyés au devis.
 */
export default function TermsPage() {
  const { legal, contact, hours } = site;
  const seller = legal.companyName;

  return (
    <LegalPage
      title="Conditions générales de vente"
      intro={
        <p>
          Conditions applicables aux ventes conclues entre {seller} et ses
          clients professionnels.
        </p>
      }
    >
      <h2>1. Vendeur</h2>
      <p>
        {seller}, {legal.legalForm} au capital de {legal.capital}, dont le siège
        social est situé {contact.streetAddress}, {contact.postalCode}{" "}
        {contact.city}, immatriculée sous le numéro SIREN {legal.siren}, TVA
        intracommunautaire {legal.vatNumber} (ci-après « {seller} »). Contact :{" "}
        <a href={contact.phoneHref}>{contact.phone}</a>,{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>

      <h2>2. Champ d&apos;application</h2>
      <p>
        Les présentes conditions générales de vente (CGV) s&apos;appliquent à
        toutes les ventes de produits (boissons, épicerie sucrée et salée)
        conclues par {seller} avec des clients professionnels (commerces, cafés,
        restaurants, grandes surfaces et autres entreprises), quel que soit le
        canal de la demande : site internet, téléphone ou e-mail. Elles ne
        s&apos;appliquent pas aux ventes à des consommateurs.
      </p>
      <p>
        Conformément à l&apos;article L.441-1 du Code de commerce, elles
        constituent le socle unique de la négociation commerciale. Elles
        prévalent sur les conditions d&apos;achat du client, sauf accord écrit
        et préalable de {seller}. Le fait pour {seller} de ne pas se prévaloir
        d&apos;une clause ne vaut pas renonciation à celle-ci.
      </p>

      <h2>3. Demande de devis</h2>
      <p>
        Le site présente les produits à titre informatif. La sélection de
        produits et l&apos;envoi d&apos;une demande de devis ou de contact
        n&apos;engagent ni le client, ni {seller}.
      </p>
      <p>
        En réponse, {seller} adresse au client un devis précisant notamment les
        produits, leur conditionnement, les quantités, les prix hors taxes, les
        taxes applicables, les conditions de livraison ou de retrait, les
        conditions de paiement et la durée de validité de l&apos;offre. Le cas
        échéant, le devis mentionne un minimum de commande.
      </p>

      <h2>4. Commande</h2>
      <p>
        La commande est formée par l&apos;acceptation écrite du devis par le
        client (devis signé ou accord exprès par e-mail) pendant sa durée de
        validité. Le devis accepté et les présentes CGV forment ensemble le
        contrat de vente.
      </p>
      <p>
        Toute modification ou annulation d&apos;une commande acceptée requiert
        l&apos;accord écrit de {seller}. Les frais déjà engagés (préparation,
        transport) peuvent alors être facturés au client.
      </p>
      <p>
        Les ventes étant conclues entre professionnels, elles n&apos;ouvrent pas
        droit au délai de rétractation prévu par le Code de la consommation.
      </p>

      <h2>5. Produits</h2>
      <p>
        Les produits sont décrits avec leur conditionnement (nombre
        d&apos;unités par pack, contenance). Les visuels du site sont non
        contractuels. Les produits sont proposés dans la limite des stocks
        disponibles : en cas d&apos;indisponibilité après acceptation du devis,{" "}
        {seller} en informe le client et lui propose un produit équivalent ou
        l&apos;annulation de la ligne concernée, sans autre indemnité.
      </p>

      <h2>6. Prix</h2>
      <p>
        Les prix sont ceux figurant sur le devis accepté. Ils sont exprimés en
        euros, hors taxes. Ils sont majorés de la TVA au taux en vigueur à la
        date de facturation et des taxes et contributions applicables à certains
        produits, notamment aux boissons contenant des sucres ajoutés ou des
        édulcorants. Les remises éventuelles, liées notamment aux volumes
        commandés, ainsi que les frais de livraison, sont indiqués sur le devis.
      </p>

      <h2>7. Facturation et paiement</h2>
      <p>
        Une facture est établie pour chaque livraison ou retrait. Le paiement
        s&apos;effectue par les moyens et dans le délai indiqués sur le devis et
        la facture. À défaut de délai convenu, le paiement est dû le trentième
        jour suivant la réception des marchandises. Le délai convenu ne peut
        excéder soixante jours à compter de la date d&apos;émission de la
        facture, ou quarante-cinq jours fin de mois (article L.441-10 du Code de
        commerce). Aucun escompte n&apos;est accordé en cas de paiement
        anticipé.
      </p>
      <p>
        Tout retard de paiement entraîne de plein droit, dès le jour suivant la
        date d&apos;échéance et sans mise en demeure préalable :
      </p>
      <ul>
        <li>
          des pénalités de retard calculées au taux d&apos;intérêt appliqué par
          la Banque centrale européenne à son opération de refinancement la plus
          récente, majoré de 10 points de pourcentage ;
        </li>
        <li>
          une indemnité forfaitaire pour frais de recouvrement de 40 € (articles
          L.441-10 et D.441-5 du Code de commerce), sans préjudice d&apos;une
          indemnisation complémentaire sur justificatifs.
        </li>
      </ul>
      <p>
        En cas de retard de paiement, {seller} peut en outre suspendre les
        livraisons en cours et à venir jusqu&apos;au complet règlement des
        sommes dues.
      </p>

      <h2>8. Livraison et retrait</h2>
      <h3>Livraison</h3>
      <p>
        {seller} livre en France métropolitaine, à l&apos;adresse indiquée par
        le client. Les délais de livraison sont précisés sur le devis ; ils sont
        donnés à titre indicatif et leur dépassement ne peut justifier
        l&apos;annulation de la commande ni le versement d&apos;indemnités, sauf
        accord écrit contraire. Le client veille à ce que le lieu de livraison
        soit accessible et à ce qu&apos;une personne soit présente pour
        réceptionner la marchandise.
      </p>
      <h3>Retrait au dépôt</h3>
      <p>
        Le client peut retirer sa commande au dépôt de {seller},{" "}
        {contact.streetAddress}, {contact.postalCode} {contact.city}, aux
        horaires d&apos;ouverture ({hours.label}), une fois la commande déclarée
        prête par {seller}.
      </p>
      <h3>Transfert des risques</h3>
      <p>
        Les risques de perte et de détérioration des produits sont transférés au
        client dès leur remise, à la livraison ou au retrait.
      </p>

      <h2>9. Réception et réclamations</h2>
      <p>
        Le client vérifie les produits à leur réception. En cas d&apos;avarie,
        de manquant ou de non-conformité apparente, il émet des réserves
        précises sur le bon de livraison et les confirme au transporteur par
        lettre recommandée dans les trois jours, non compris les jours fériés,
        qui suivent la réception (article L.133-3 du Code de commerce), en en
        informant {seller} dans le même délai à{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>. À défaut, les
        produits sont réputés reçus conformes.
      </p>
      <p>
        Lorsqu&apos;une réclamation est reconnue fondée, {seller} procède, à son
        choix, au remplacement des produits concernés ou à l&apos;émission
        d&apos;un avoir.
      </p>

      <h2>10. Réserve de propriété</h2>
      <p>
        {seller} conserve la propriété des produits vendus jusqu&apos;au
        paiement intégral de leur prix en principal et accessoires (articles
        2367 et suivants du Code civil). Ces dispositions ne font pas obstacle
        au transfert des risques prévu à l&apos;article 8. En cas de défaut de
        paiement, {seller} peut revendiquer les produits encore en possession du
        client.
      </p>

      <h2>11. Responsabilité et force majeure</h2>
      <p>
        La responsabilité de {seller} est limitée aux dommages directs et
        prouvés et ne peut excéder le montant de la commande concernée. {seller}{" "}
        ne saurait être tenue responsable de l&apos;inexécution de ses
        obligations en cas de force majeure au sens de l&apos;article 1218 du
        Code civil.
      </p>

      <h2>12. Données personnelles</h2>
      <p>
        Les données communiquées par le client sont traitées conformément à
        notre <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>13. Droit applicable et litiges</h2>
      <p>
        Les présentes CGV et les ventes qu&apos;elles régissent sont soumises au
        droit français. Les parties rechercheront d&apos;abord une solution
        amiable. À défaut, tout litige relatif à leur formation, leur
        interprétation ou leur exécution relève de la compétence exclusive du
        tribunal de commerce dans le ressort duquel se trouve le siège social de{" "}
        {seller}, y compris en cas de pluralité de défendeurs ou d&apos;appel en
        garantie.
      </p>
    </LegalPage>
  );
}
