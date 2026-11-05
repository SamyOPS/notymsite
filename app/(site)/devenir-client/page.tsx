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
  { title: "Tarifs grossiste", text: "Des prix dégressifs selon vos volumes." },
  {
    title: "Commandes en volume",
    text: "Livraison partout en France ou retrait au dépôt.",
  },
  {
    title: "Un conseiller dédié",
    text: "Un interlocuteur du lundi au samedi.",
  },
];

export default function BecomeClientPage() {
  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Devenir client" },
        ]}
        title="Devenir client Notym"
        intro={
          <p>
            Décrivez votre activité et votre besoin : nous vous répondons avec
            une proposition adaptée. {site.claims.responseTime}.
          </p>
        }
      />

      <div className="container-site grid gap-14 border-t border-ink pt-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
        <section aria-labelledby="formulaire-titre">
          <h2 id="formulaire-titre" className="sr-only">
            Votre demande
          </h2>
          <BecomeClientForm />
        </section>

        <aside className="flex flex-col gap-10 lg:pt-1">
          <section aria-labelledby="avantages-titre">
            <h2 id="avantages-titre" className="font-sans text-label">
              Pourquoi Notym
            </h2>
            <ul className="mt-3 border-t border-line">
              {advantages.map((advantage) => (
                <li key={advantage.title} className="border-b border-line py-4">
                  <p className="text-body font-semibold">{advantage.title}</p>
                  <p className="text-body text-ink-muted">{advantage.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="contact-direct">
            <h2 id="contact-direct" className="font-sans text-label">
              Nous contacter directement
            </h2>
            <ul className="mt-3 flex flex-col text-body">
              <li>
                <a
                  href={site.contact.phoneHref}
                  className="inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                >
                  {site.contact.email}
                </a>
              </li>
              <li className="text-ink-muted">{site.hours.label}</li>
              <li className="mt-2 text-ink-muted">
                {site.contact.streetAddress}, {site.contact.postalCode}{" "}
                {site.contact.city}
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}
