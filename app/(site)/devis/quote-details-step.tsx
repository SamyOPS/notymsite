"use client";

import { ArrowLeft, ArrowRight, Store } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import {
  AddressFields,
  CompanyFields,
  ErrorSummary,
  fieldId,
  type FieldMap,
} from "@/components/forms/form-parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PillRadioGroup } from "@/components/ui/pill-radio-group";
import { Textarea } from "@/components/ui/textarea";
import { firstErrors } from "@/lib/validation/fields";
import {
  quoteDetailsSchema,
  quoteDetailsTextFields,
  receptionModes,
} from "@/lib/validation/quote-request";
import { site } from "@/lib/site";

const labels = [
  ["receptionMode", "Mode de réception"],
  ["establishmentType", "Type d'établissement"],
  ["companyName", "Raison sociale"],
  ["siret", "SIRET"],
  ["contactName", "Nom du contact"],
  ["phone", "Téléphone"],
  ["email", "E-mail professionnel"],
  ["addressLine", "Adresse de livraison"],
  ["postalCode", "Code postal"],
  ["city", "Ville"],
  ["message", "Précisions"],
  ["discountCode", "Code remise"],
] as const;

type QuoteDetailsStepProps = {
  initialValues: FieldMap;
  /** Erreurs renvoyées par le serveur, le cas échéant. */
  initialErrors: FieldMap;
  onBack: (values: FieldMap) => void;
  onContinue: (values: FieldMap) => void;
};

function readValues(form: HTMLFormElement): FieldMap {
  const data = new FormData(form);
  const values: FieldMap = {};
  for (const field of quoteDetailsTextFields) {
    const value = data.get(field);
    if (typeof value === "string") values[field] = value;
  }
  return values;
}

/** Étape 2 : mode de réception et coordonnées, validés avant de passer à l'envoi. */
export function QuoteDetailsStep({
  initialValues,
  initialErrors,
  onBack,
  onContinue,
}: QuoteDetailsStepProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<FieldMap>(initialErrors);
  const [mode, setMode] = useState(initialValues.receptionMode ?? "");
  // Valeurs conservées entre deux validations (champs non contrôlés).
  const [values, setValues] = useState<FieldMap>(initialValues);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const current = readValues(event.currentTarget);
    const parsed = quoteDetailsSchema.safeParse(current);
    if (!parsed.success) {
      setValues(current);
      setErrors(firstErrors<string>(parsed.error));
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    onContinue(current);
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={submit}
      onChange={(event) => {
        const target = event.target;
        if (
          !(target instanceof HTMLInputElement) ||
          target.name !== "receptionMode"
        )
          return;
        // Mémorise la saisie : les champs d'adresse sont démontés en retrait.
        setValues(readValues(event.currentTarget));
        setMode(target.value);
      }}
      className="flex flex-col gap-10"
    >
      <ErrorSummary ref={summaryRef} errors={errors} labels={labels} />

      <p className="text-caption text-ink-muted">
        Les champs marqués <span className="text-danger">*</span> sont
        obligatoires.
      </p>

      <PillRadioGroup
        id={fieldId("receptionMode")}
        legend="Mode de réception"
        name="receptionMode"
        options={receptionModes}
        defaultValue={values.receptionMode}
        required
        error={errors.receptionMode}
      />

      {mode === "retrait" && (
        <p className="flex items-start gap-3 rounded-md surface-teal-soft p-4 text-body">
          <Store
            aria-hidden
            className="mt-0.5 size-5 shrink-0 text-teal-deep"
          />
          <span>
            Retrait au dépôt : {site.contact.streetAddress},{" "}
            {site.contact.postalCode} {site.contact.city}. {site.hours.label}.
          </span>
        </p>
      )}

      <CompanyFields values={values} errors={errors} />
      {mode === "livraison" && (
        <AddressFields values={values} errors={errors} />
      )}

      <Textarea
        id={fieldId("message")}
        label="Précisions"
        name="message"
        hint="Facultatif : date souhaitée, fréquence de commande, contraintes d'accès…"
        rows={4}
        defaultValue={values.message}
        error={errors.message}
      />

      <Input
        id={fieldId("discountCode")}
        label="Code remise"
        name="discountCode"
        hint="Facultatif."
        autoComplete="off"
        defaultValue={values.discountCode}
        error={errors.discountCode}
        fieldClassName="sm:max-w-xs"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={() =>
            onBack(formRef.current ? readValues(formRef.current) : values)
          }
        >
          <ArrowLeft aria-hidden /> Retour à la sélection
        </Button>
        <Button type="submit" size="lg">
          Vérifier ma demande <ArrowRight aria-hidden />
        </Button>
      </div>
    </form>
  );
}
