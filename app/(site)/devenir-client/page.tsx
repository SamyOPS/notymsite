import {
  BadgeEuro,
  Clock,
  Mail,
  MapPin,
  Phone,
  Truck,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { site } from "@/lib/site";
import { BecomeClientForm } from "./become-client-form";

export const metadata: Metadata = {
  title: "Devenir client",
  description:
    "Professionnels : envoyez votre demande de devis ou de contact à Notym, grossiste en boissons et snacks à Montataire (60).",
  alternates: { canonical: "/devenir-client" },
};

/** Avantages repris de la page « Devenir client » du site actuel. */
const advantages = [
  {
    icon: BadgeEuro,
    title: "Tarifs grossiste",
    text: "Des prix dégressifs selon vos volumes.",
  },
  {
    icon: Truck,
    title: "Commandes en volume",
    text: "Livraison partout en France ou retrait au dépôt.",
  },
  {
    icon: UserRound,
    title: "Un conseiller dédié",
    text: "Un interlocuteur du lundi au samedi.",
  },
];

export default function BecomeClientPage() {
  return (
    <>
      <PageHero
        tone="inverse"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Devenir client" },
        ]}
        eyebrow="Professionnels"
        title="Devenir client Notym"
        intro={
          <p>
            Décrivez votre activité et votre besoin : nous vous répondons avec
            une proposition adaptée. {site.claims.responseTime}.
          </p>
        }
      >
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {advantages.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-md surface-teal">
                <Icon aria-hidden className="size-6" />
              </span>
              <div>
                <p className="text-body-lg font-semibold">{title}</p>
                <p className="text-body">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </PageHero>

      <div className="container-site grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-20">
        <section
          aria-labelledby="formulaire-titre"
          className="rounded-lg border border-line bg-surface-raised p-6 shadow-card sm:p-10"
        >
          <h2 id="formulaire-titre" className="mb-8 text-h2">
            Votre demande
          </h2>
          <BecomeClientForm />
        </section>

        <aside
          aria-labelledby="contact-direct"
          className="flex flex-col gap-6 lg:pt-4"
        >
          <h2 id="contact-direct" className="text-h3">
            Nous contacter directement
          </h2>
          <ul className="flex flex-col gap-4 text-body">
            <li>
              <a
                href={site.contact.phoneHref}
                className="flex min-h-11 items-center gap-3 font-semibold"
              >
                <Phone aria-hidden className="size-5 text-teal-deep" />{" "}
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="flex min-h-11 items-center gap-3"
              >
                <Mail aria-hidden className="size-5 text-teal-deep" />{" "}
                {site.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-teal-deep"
              />
              {site.hours.label}
            </li>
            <li className="flex items-start gap-3">
              <MapPin
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-teal-deep"
              />
              <span>
                {site.contact.streetAddress}
                <br />
                {site.contact.postalCode} {site.contact.city}
              </span>
            </li>
          </ul>
        </aside>
      </div>
    </>
  );
}
