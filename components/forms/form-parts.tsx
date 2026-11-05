import Link from "next/link";
import type { Ref } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PillRadioGroup } from "@/components/ui/pill-radio-group";
import { establishmentTypes } from "@/lib/validation/fields";

/** Valeurs et erreurs d'un formulaire, indexées par nom de champ. */
export type FieldMap = Partial<Record<string, string>>;

export const fieldId = (field: string) => `champ-${field}`;

/** Récapitulatif des erreurs en tête de formulaire, avec un lien vers chaque champ. */
export function ErrorSummary({
  errors,
  labels,
  ref,
}: {
  errors: FieldMap;
  /** Libellés des champs, dans l'ordre d'affichage du formulaire. */
  labels: ReadonlyArray<readonly [field: string, label: string]>;
  ref?: Ref<HTMLDivElement>;
}) {
  const list = labels.filter(([field]) => errors[field]);
  if (list.length === 0) return null;
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="rounded-md border-2 border-danger bg-surface-raised p-5 focus:outline-none"
    >
      <h2 className="font-sans text-body-lg font-semibold text-danger">
        {list.length > 1
          ? `${list.length} champs sont à corriger :`
          : "Un champ est à corriger :"}
      </h2>
      <ul className="mt-2 list-disc pl-5 text-body">
        {list.map(([field, label]) => (
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
  );
}

/** Type d'établissement, entreprise (raison sociale, SIRET) et contact. */
export function CompanyFields({
  values,
  errors,
}: {
  values: FieldMap;
  errors: FieldMap;
}) {
  return (
    <>
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
    </>
  );
}

/** Adresse de livraison : adresse, code postal, ville. */
export function AddressFields({
  values,
  errors,
}: {
  values: FieldMap;
  errors: FieldMap;
}) {
  return (
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
  );
}

/** Consentement RGPD obligatoire, avec lien vers la politique de confidentialité. */
export function ConsentCheckbox({
  defaultChecked,
  error,
}: {
  defaultChecked?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        id={fieldId("consent")}
        name="consent"
        required
        defaultChecked={defaultChecked}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "erreur-consentement" : undefined}
        className="items-start [&>input]:mt-0.5"
      >
        J&apos;accepte que Notym utilise ces informations pour traiter ma
        demande et me recontacter. Voir la{" "}
        <Link href="/confidentialite" className="text-teal-deep underline">
          politique de confidentialité
        </Link>
        . <span className="text-danger">*</span>
      </Checkbox>
      {error && (
        <p
          id="erreur-consentement"
          className="text-caption font-semibold text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/** Pot de miel anti-robots : invisible et ignoré par les lecteurs d'écran. */
export function Honeypot() {
  return (
    <div
      aria-hidden
      className="absolute -left-[9999px] h-px w-px overflow-hidden"
    >
      <label>
        Site web
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/** Message affiché tant qu'aucun canal d'envoi n'est branché en production. */
export function UnavailableNotice({
  phone,
  phoneHref,
  email,
  ref,
}: {
  phone: string;
  phoneHref: string;
  email: string;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="rounded-md border-2 border-danger bg-surface-raised p-5 focus:outline-none"
    >
      <h2 className="font-sans text-body-lg font-semibold text-danger">
        L&apos;envoi en ligne n&apos;est pas encore disponible.
      </h2>
      <p className="mt-2 text-body">
        Contactez-nous au{" "}
        <a href={phoneHref} className="font-semibold underline">
          {phone}
        </a>{" "}
        ou à{" "}
        <a href={`mailto:${email}`} className="font-semibold underline">
          {email}
        </a>
        . Vos réponses sont conservées.
      </p>
    </div>
  );
}
