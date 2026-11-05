"use client";

import { ArrowLeft, Send } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import {
  ConsentCheckbox,
  Honeypot,
  UnavailableNotice,
  type FieldMap,
} from "@/components/forms/form-parts";
import { Button } from "@/components/ui/button";
import { packagingLabel } from "@/lib/format";
import type { QuoteLine } from "@/lib/quote/lines";
import { site } from "@/lib/site";
import { establishmentTypes } from "@/lib/validation/fields";
import type { QuoteProduct } from "@/types/catalog";

type QuoteReviewStepProps = {
  lines: QuoteLine[];
  products: ReadonlyMap<string, QuoteProduct>;
  details: FieldMap;
  consentError?: string;
  unavailable: boolean;
  sending: boolean;
  onEdit: (step: 1 | 2) => void;
  onSend: (form: { consent?: string; website?: string }) => void;
};

/** Étape 3 : relecture complète, consentement et envoi. */
export function QuoteReviewStep({
  lines,
  products,
  details,
  consentError,
  unavailable,
  sending,
  onEdit,
  onSend,
}: QuoteReviewStepProps) {
  const establishment = establishmentTypes.find(
    (t) => t.value === details.establishmentType,
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSend({
      consent: data.get("consent") === "on" ? "on" : undefined,
      website: String(data.get("website") ?? "") || undefined,
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {unavailable && (
        <UnavailableNotice
          phone={site.contact.phone}
          phoneHref={site.contact.phoneHref}
          email={site.contact.email}
        />
      )}

      <ReviewSection
        title="Produits"
        onEdit={() => onEdit(1)}
        editLabel="Modifier la sélection"
      >
        <ul className="flex flex-col divide-y divide-line">
          {lines.map((line) => {
            const product = products.get(line.productId);
            if (!product) return null;
            return (
              <li
                key={line.productId}
                className="flex justify-between gap-4 py-3"
              >
                <span>
                  <span className="font-semibold">{product.name}</span>
                  <span className="block text-caption text-ink-muted">
                    {packagingLabel(product.packLabel, product.volume)}
                  </span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {line.quantity} pack{line.quantity > 1 ? "s" : ""}
                </span>
              </li>
            );
          })}
        </ul>
      </ReviewSection>

      <ReviewSection
        title="Réception et coordonnées"
        onEdit={() => onEdit(2)}
        editLabel="Modifier les coordonnées"
      >
        <dl className="grid gap-x-6 gap-y-3 text-body sm:grid-cols-[12rem_1fr]">
          <Row term="Réception">
            {details.receptionMode === "retrait"
              ? `Retrait au dépôt de ${site.contact.city}`
              : `Livraison : ${details.addressLine}, ${details.postalCode} ${details.city}`}
          </Row>
          <Row term="Établissement">
            {details.companyName}
            {establishment ? ` (${establishment.label})` : ""}
          </Row>
          <Row term="SIRET">{details.siret}</Row>
          <Row term="Contact">{details.contactName}</Row>
          <Row term="Téléphone">{details.phone}</Row>
          <Row term="E-mail">{details.email}</Row>
          {details.message && <Row term="Précisions">{details.message}</Row>}
          {details.discountCode && (
            <Row term="Code remise">{details.discountCode}</Row>
          )}
        </dl>
      </ReviewSection>

      <form
        noValidate
        onSubmit={submit}
        className="relative flex flex-col gap-6"
      >
        <Honeypot />
        <ConsentCheckbox error={consentError} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="secondary"
            onClick={() => onEdit(2)}
            disabled={sending}
          >
            <ArrowLeft aria-hidden /> Retour
          </Button>
          <Button type="submit" size="lg" disabled={sending}>
            <Send aria-hidden />
            {sending ? "Envoi en cours…" : "Envoyer ma demande de devis"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ReviewSection({
  title,
  editLabel,
  onEdit,
  children,
}: {
  title: string;
  editLabel: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-surface-raised p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-h3">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex min-h-11 items-center text-label text-teal-deep underline underline-offset-4"
        >
          {editLabel}
        </button>
      </div>
      {children}
    </section>
  );
}

function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-ink-muted">{term}</dt>
      <dd className="font-semibold break-words">{children}</dd>
    </>
  );
}
