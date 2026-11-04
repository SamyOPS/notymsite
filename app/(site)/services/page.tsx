import {
  ArrowRight,
  Boxes,
  Handshake,
  MapPin,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Livraison partout en France, retrait au dépôt de Montataire, large choix de grandes marques et accompagnement dédié aux professionnels.",
  alternates: { canonical: "/services" },
};

const services: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: Truck,
    title: "Livraison partout en France",
    text: `${site.claims.deliveryTime}.`,
  },
  {
    icon: MapPin,
    title: "Retrait au dépôt",
    text: `Retirez vos produits à Montataire (60), du lundi au samedi de 9h30 à 17h30.`,
  },
  {
    icon: Boxes,
    title: site.claims.references,
    text: "Sodas, eaux, énergisants, jus et snacks des grandes marques.",
  },
  {
    icon: Handshake,
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
        tone="inverse"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Nos services" },
        ]}
        eyebrow="Nos services"
        title="Un grossiste au service des professionnels"
        intro={
          <p>
            Disponibilité des produits, livraison rapide et accompagnement :
            Notym fournit les commerces et la restauration partout en France
            depuis Montataire (60).
          </p>
        }
      />

      <section
        aria-labelledby="services-titre"
        className="container-site py-20"
      >
        <h2 id="services-titre" className="sr-only">
          Nos services
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="flex flex-col gap-4 rounded-lg border border-line bg-surface-raised p-6 shadow-card"
            >
              <span className="flex size-12 items-center justify-center rounded-md bg-teal-soft text-teal-deep">
                <Icon aria-hidden className="size-6" />
              </span>
              <h3 className="text-h3">{title}</h3>
              <p className="text-body text-ink-muted">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="etapes-titre"
        className="border-y border-line bg-surface-raised py-20"
      >
        <div className="container-site">
          <SectionHeader
            eyebrow="Comment ça marche"
            title="Commander en 3 étapes"
            titleId="etapes-titre"
          />
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-3">
                <span
                  aria-hidden
                  className="flex size-12 items-center justify-center rounded-pill bg-ink font-display text-h3 text-surface"
                >
                  {index + 1}
                </span>
                <h3 className="text-h3">
                  <span className="sr-only">Étape {index + 1} : </span>
                  {step.title}
                </h3>
                <p className="text-body text-ink-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="cibles-titre" className="container-site py-20">
        <SectionHeader
          eyebrow="Nos clients"
          title="Pour qui ?"
          titleId="cibles-titre"
        />
        <ul className="mt-8 flex flex-wrap gap-3">
          {audiences.map((audience) => (
            <li
              key={audience}
              className="inline-flex min-h-11 items-center rounded-pill border border-line-strong bg-surface-raised px-5 text-body font-medium"
            >
              {audience}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="services-cta" className="container-site pb-20">
        <div className="flex flex-col gap-6 rounded-lg surface-teal p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 id="services-cta" className="text-h2">
              Prêt à passer commande ?
            </h2>
            <p className="mt-3 text-body-lg">
              Parcourez le catalogue ou envoyez-nous votre demande.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/devenir-client" size="lg" variant="dark">
              Devenir client
            </ButtonLink>
            <ButtonLink href="/catalogue" size="lg" variant="secondary">
              Voir le catalogue <ArrowRight aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
