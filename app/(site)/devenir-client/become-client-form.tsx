"use client";

import { CheckCircle2, Phone } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PillRadioGroup } from "@/components/ui/pill-radio-group";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/lib/site";
import {
  establishmentTypes,
  requestKinds,
  type ContactRequestField,
} from "@/lib/validation/contact-request";
import { submitContactRequest, type ContactFormState } from "./actions";

const initialState: ContactFormState = { status: "idle" };

/** Ordre d'affichage, pour le récapitulatif des erreurs. */
const fieldOrder: Array<{ field: ContactRequestField; label: string }> = [
  { field: "kind", label: "Votre demande" },
  { field: "establishmentType", label: "Type d'établissement" },
  { field: "companyName", label: "Raison sociale" },
  { field: "siret", label: "SIRET" },
  { field: "contactName", label: "Nom du contact" },
  { field: "phone", label: "Téléphone" },
  { field: "email", label: "E-mail professionnel" },
  { field: "addressLine", label: "Adresse de livraison" },
  { field: "postalCode", label: "Code postal" },
  { field: "city", label: "Ville" },
  { field: "message", label: "Votre besoin" },
  { field: "consent", label: "Consentement" },
];

const fieldId = (field: ContactRequestField) => `champ-${field}`;

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
  const errorList = fieldOrder.filter(({ field }) => errors[field]);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-10">
      {state.status === "invalid" && (
        <div
          ref={alertRef}
          tabIndex={-1}
          role="alert"
          className="rounded-md border-2 border-danger bg-surface-raised p-5 focus:outline-none"
        >
          <h2 className="font-sans text-body-lg font-semibold text-danger">
            {errorList.length > 1
              ? `${errorList.length} champs sont à corriger :`
              : "Un champ est à corriger :"}
          </h2>
          <ul className="mt-2 list-disc pl-5 text-body">
            {errorList.map(({ field, label }) => (
              <li key={field}>
                <a
                  href={`#${fieldId(field)}`}
                  className="underline underline-offset-4"
                >
                  {label} : {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.status === "unavailable" && (
        <div
          ref={alertRef}
          tabIndex={-1}
          role="alert"
          className="rounded-md border-2 border-danger bg-surface-raised p-5 focus:outline-none"
        >
          <h2 className="font-sans text-body-lg font-semibold text-danger">
            L&apos;envoi en ligne n&apos;est pas encore disponible.
          </h2>
          <p className="mt-2 text-body">
            Contactez-nous au{" "}
            <a
              href={site.contact.phoneHref}
              className="font-semibold underline"
            >
              {site.contact.phone}
            </a>{" "}
            ou à{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="font-semibold underline"
            >
              {site.contact.email}
            </a>
            . Vos réponses sont conservées ci-dessous.
          </p>
        </div>
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

      <PillRadioGroup
        id={fieldId("establishmentType")}
        legend="Type d'établissement"
        name="establishmentType"
        options={establishmentTypes}
        defaultValue={values.establishmentType}
        required
        error={errors.establishmentType}
      />

      <fieldset className="grid gap-6 sm:grid-cols-2">
        <legend className="mb-4 font-display text-h3">Votre entreprise</legend>
        <Input
          id={fieldId("companyName")}
          label="Raison sociale"
          name="companyName"
          autoComplete="organization"
          required
          defaultValue={values.companyName}
          error={errors.companyName}
        />
        <Input
          id={fieldId("siret")}
          label="SIRET"
          name="siret"
          inputMode="numeric"
          hint="14 chiffres, présents sur votre extrait Kbis."
          required
          defaultValue={values.siret}
          error={errors.siret}
        />
      </fieldset>

      <fieldset className="grid gap-6 sm:grid-cols-2">
        <legend className="mb-4 font-display text-h3">Contact</legend>
        <Input
          id={fieldId("contactName")}
          label="Nom du contact"
          name="contactName"
          autoComplete="name"
          required
          defaultValue={values.contactName}
          error={errors.contactName}
          fieldClassName="sm:col-span-2"
        />
        <Input
          id={fieldId("phone")}
          label="Téléphone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          defaultValue={values.phone}
          error={errors.phone}
        />
        <Input
          id={fieldId("email")}
          label="E-mail professionnel"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={values.email}
          error={errors.email}
        />
      </fieldset>

      <fieldset className="grid gap-6 sm:grid-cols-[1fr_10rem_1fr]">
        <legend className="mb-4 font-display text-h3">
          Adresse de livraison
        </legend>
        <Input
          id={fieldId("addressLine")}
          label="Adresse"
          name="addressLine"
          autoComplete="street-address"
          required
          defaultValue={values.addressLine}
          error={errors.addressLine}
          fieldClassName="sm:col-span-3"
        />
        <Input
          id={fieldId("postalCode")}
          label="Code postal"
          name="postalCode"
          inputMode="numeric"
          autoComplete="postal-code"
          required
          defaultValue={values.postalCode}
          error={errors.postalCode}
          fieldClassName="sm:col-start-1 sm:col-end-2 sm:max-w-40"
        />
        <Input
          id={fieldId("city")}
          label="Ville"
          name="city"
          autoComplete="address-level2"
          required
          defaultValue={values.city}
          error={errors.city}
          fieldClassName="sm:col-span-2"
        />
      </fieldset>

      <Textarea
        id={fieldId("message")}
        label="Votre besoin"
        name="message"
        hint="Produits, volumes, fréquence de livraison ou retrait au dépôt."
        defaultValue={values.message}
        error={errors.message}
      />

      {/* Pot de miel anti-robots : invisible et ignoré par les lecteurs d'écran. */}
      <div
        aria-hidden
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label>
          Site web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <Checkbox
          id={fieldId("consent")}
          name="consent"
          required
          defaultChecked={values.consent === "on"}
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? "erreur-consentement" : undefined}
          className="items-start [&>input]:mt-0.5"
        >
          J&apos;accepte que Notym utilise ces informations pour traiter ma
          demande et me recontacter. Voir la{" "}
          <Link
            href="/confidentialite"
            className="relative z-10 text-teal-deep underline"
          >
            politique de confidentialité
          </Link>
          . <span className="text-danger">*</span>
        </Checkbox>
        {errors.consent && (
          <p
            id="erreur-consentement"
            className="text-caption font-semibold text-danger"
          >
            {errors.consent}
          </p>
        )}
      </div>

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
