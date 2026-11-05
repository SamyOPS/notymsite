"use client";

import { CheckCircle2, Phone } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import {
  AddressFields,
  CompanyFields,
  ConsentCheckbox,
  ErrorSummary,
  fieldId,
  Honeypot,
  UnavailableNotice,
} from "@/components/forms/form-parts";
import { Button, ButtonLink } from "@/components/ui/button";
import { PillRadioGroup } from "@/components/ui/pill-radio-group";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/lib/site";
import { requestKinds } from "@/lib/validation/contact-request";
import { submitContactRequest, type ContactFormState } from "./actions";

const initialState: ContactFormState = { status: "idle" };

/** Ordre d'affichage, pour le récapitulatif des erreurs. */
const labels = [
  ["kind", "Votre demande"],
  ["establishmentType", "Type d'établissement"],
  ["companyName", "Raison sociale"],
  ["siret", "SIRET"],
  ["contactName", "Nom du contact"],
  ["phone", "Téléphone"],
  ["email", "E-mail professionnel"],
  ["addressLine", "Adresse de livraison"],
  ["postalCode", "Code postal"],
  ["city", "Ville"],
  ["message", "Votre besoin"],
  ["consent", "Consentement"],
] as const;

export function BecomeClientForm() {
  const [state, formAction, pending] = useActionState(
    submitContactRequest,
    initialState,
  );
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Focus sur le message utile après chaque envoi.
  useEffect(() => {
    if (state.status === "invalid" || state.status === "unavailable")
      alertRef.current?.focus();
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="flex flex-col items-start gap-4 rounded-lg surface-teal-soft p-8 focus:outline-none"
      >
        <CheckCircle2 aria-hidden className="size-10 text-teal-deep" />
        <h2 className="text-h2">Merci, votre demande est bien envoyée.</h2>
        {state.reference && (
          <p className="text-body">
            Référence :{" "}
            <strong className="tabular-nums">{state.reference}</strong>
          </p>
        )}
        <p className="max-w-xl text-body-lg">
          Notre équipe étudie votre demande et revient vers vous.{" "}
          {site.claims.responseTime}.
        </p>
        <p className="text-body">
          Une question urgente ? Appelez-nous au{" "}
          <a
            href={site.contact.phoneHref}
            className="font-semibold text-teal-deep underline"
          >
            {site.contact.phone}
          </a>
          .
        </p>
        <ButtonLink href="/catalogue" size="lg" className="mt-2">
          Voir le catalogue
        </ButtonLink>
      </div>
    );
  }

  const values = state.status === "idle" ? {} : state.values;
  const errors = state.status === "invalid" ? state.errors : {};

  return (
    <form action={formAction} noValidate className="flex flex-col gap-10">
      {state.status === "invalid" && (
        <ErrorSummary ref={alertRef} errors={errors} labels={labels} />
      )}
      {state.status === "unavailable" && (
        <UnavailableNotice
          ref={alertRef}
          phone={site.contact.phone}
          phoneHref={site.contact.phoneHref}
          email={site.contact.email}
        />
      )}

      <p className="text-caption text-ink-muted">
        Les champs marqués <span className="text-danger">*</span> sont
        obligatoires.
      </p>

      <PillRadioGroup
        id={fieldId("kind")}
        legend="Votre demande"
        name="kind"
        options={requestKinds}
        defaultValue={values.kind ?? "devis"}
        required
        error={errors.kind}
      />

      <CompanyFields values={values} errors={errors} />
      <AddressFields values={values} errors={errors} />

      <Textarea
        id={fieldId("message")}
        label="Votre besoin"
        name="message"
        hint="Produits, volumes, fréquence de livraison ou retrait au dépôt."
        defaultValue={values.message}
        error={errors.message}
      />

      <Honeypot />
      <ConsentCheckbox
        defaultChecked={values.consent === "on"}
        error={errors.consent}
      />

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Envoi en cours…" : "Envoyer ma demande"}
        </Button>
        <a
          href={site.contact.phoneHref}
          className="inline-flex min-h-11 items-center gap-2 text-body font-semibold text-teal-deep"
        >
          <Phone aria-hidden className="size-5" /> Ou appelez le{" "}
          {site.contact.phone}
        </a>
      </div>
    </form>
  );
}
