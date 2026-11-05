import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ProBand } from "@/components/layout/pro-band";
import { SectionHeader } from "@/components/ui/section-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Livraison partout en France, retrait au dépôt de Montataire, large choix de grandes marques et accompagnement dédié aux professionnels.",
  alternates: { canonical: "/services" },
};

const services = [
  {
    title: "Livraison partout en France",
    text: `${site.claims.deliveryTime}.`,
  },
  {
    title: "Retrait au dépôt",
    text: "À Montataire (60), du lundi au samedi de 9h30 à 17h30.",
  },
  {
    title: site.claims.references,
    text: "Sodas, eaux, énergisants, jus et snacks des grandes marques.",
  },
  {
    title: "Un accompagnement dédié",
    text: "Des tarifs dégressifs selon vos volumes et un interlocuteur du lundi au samedi.",
  },
];

const steps = [
  {
    title: "Composez votre sélection",
    text: "Ajoutez les produits du catalogue à votre demande de devis.",
  },
  {
    title: "Envoyez votre demande",
    text: "Indiquez vos coordonnées, vos quantités et le mode de réception souhaité.",
  },
  {
    title: "Recevez votre devis",
    text: "Notre équipe vous recontacte. Vous choisissez la livraison ou le retrait au dépôt.",
  },
];

const audiences = [
  "Épiceries",
  "Cafés et bars",
  "Restaurants et hôtels",
  "Grandes surfaces",
  "Traiteurs et événementiel",
  "Commerce de gros",
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Nos services" },
        ]}
        title="Un grossiste au service des professionnels"
        intro={
          <p>
            Disponibilité des produits, livraison rapide et accompagnement :
            Notym fournit les commerces et la restauration partout en France
            depuis Montataire (60).
          </p>
        }
      />

      <section aria-labelledby="services-titre" className="container-site">
        <h2 id="services-titre" className="sr-only">
          Nos services
        </h2>
        <ul className="grid border-t border-ink sm:grid-cols-2">
          {services.map((service) => (
            <li
              key={service.title}
              className="border-b border-line py-8 sm:odd:pr-10 sm:even:border-l sm:even:pl-10"
            >
              <h3 className="text-h3">{service.title}</h3>
              <p className="mt-2 max-w-md text-body-lg text-ink-muted">
                {service.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="etapes-titre" className="container-site pt-20">
        <SectionHeader title="Commander en 3 étapes" titleId="etapes-titre" />
        <ol className="grid gap-10 pt-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span
                aria-hidden
                className="font-display text-h1 text-teal-deep tabular-nums"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-h3">
                <span className="sr-only">Étape {index + 1} : </span>
                {step.title}
              </h3>
              <p className="mt-2 text-body-lg text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="cibles-titre" className="container-site pt-20">
        <SectionHeader title="Pour qui ?" titleId="cibles-titre" />
        <ul className="grid gap-x-10 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((audience) => (
            <li
              key={audience}
              className="border-b border-line py-4 text-body-lg"
            >
              {audience}
            </li>
          ))}
        </ul>
      </section>

      <ProBand title="Prêt à passer commande ?" />
    </>
  );
}
