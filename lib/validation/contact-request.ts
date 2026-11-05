import { z } from "zod";
import { fields, optionValues } from "./fields";

export { establishmentTypes, normalizePhone } from "./fields";

export const requestKinds = [
  { value: "devis", label: "Demande de devis" },
  { value: "contact", label: "Demande de contact" },
] as const;

/** Formulaire « Devenir client » (demande de contact ou de devis libre). */
export const contactRequestSchema = z.object({
  kind: z.enum(optionValues(requestKinds), {
    error: "Choisissez le type de demande.",
  }),
  establishmentType: fields.establishmentType,
  companyName: fields.companyName,
  siret: fields.siret,
  contactName: fields.contactName,
  phone: fields.phone,
  email: fields.email,
  addressLine: fields.addressLine,
  postalCode: fields.postalCode,
  city: fields.city,
  message: fields.message,
  consent: fields.consent,
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;
export type ContactRequestField = keyof z.input<typeof contactRequestSchema>;

/** Champs texte du formulaire, renvoyés pour pré-remplir après une erreur. */
export const contactRequestTextFields = [
  "kind",
  "establishmentType",
  "companyName",
  "siret",
  "contactName",
  "phone",
  "email",
  "addressLine",
  "postalCode",
  "city",
  "message",
] as const satisfies ReadonlyArray<ContactRequestField>;
