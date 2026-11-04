import { z } from "zod";
import { isValidSiret, normalizeSiret } from "./siret";

export const establishmentTypes = [
  { value: "epicerie", label: "Épicerie" },
  { value: "cafe-bar", label: "Café / Bar" },
  { value: "restaurant", label: "Restaurant" },
  { value: "grande-surface", label: "Grande surface" },
  { value: "autre", label: "Autre" },
] as const;

export const requestKinds = [
  { value: "devis", label: "Demande de devis" },
  { value: "contact", label: "Demande de contact" },
] as const;

type Values<T extends ReadonlyArray<{ value: string }>> = T[number]["value"];

const establishmentValues = establishmentTypes.map((t) => t.value) as [
  Values<typeof establishmentTypes>,
  ...Values<typeof establishmentTypes>[],
];
const kindValues = requestKinds.map((k) => k.value) as [
  Values<typeof requestKinds>,
  ...Values<typeof requestKinds>[],
];

/** Numéro français : 0X XX XX XX XX, +33 X XX XX XX XX ou 0033… */
const FRENCH_PHONE = /^(?:(?:\+|00)33|0)[1-9]\d{8}$/;

export function normalizePhone(value: string): string {
  return value.replace(/[\s.\-()]/g, "");
}

const requiredText = (label: string, max = 200) =>
  z
    .string()
    .trim()
    .min(1, { error: `Indiquez ${label}.` })
    .max(max, { error: `${max} caractères maximum.` });

export const contactRequestSchema = z.object({
  kind: z.enum(kindValues, { error: "Choisissez le type de demande." }),
  establishmentType: z.enum(establishmentValues, {
    error: "Choisissez votre type d'établissement.",
  }),
  companyName: requiredText("la raison sociale"),
  siret: z
    .string()
    .trim()
    .transform(normalizeSiret)
    .refine((v) => /^\d{14}$/.test(v), {
      error: "Le SIRET compte 14 chiffres.",
      abort: true,
    })
    .refine(isValidSiret, {
      error: "Ce numéro SIRET n'est pas valide. Vérifiez les chiffres.",
    }),
  contactName: requiredText("le nom du contact"),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .refine((v) => FRENCH_PHONE.test(v), {
      error:
        "Saisissez un numéro de téléphone français, par exemple 06 12 34 56 78.",
    }),
  email: z
    .string()
    .trim()
    .pipe(
      z.email({
        error:
          "Saisissez une adresse e-mail valide, par exemple nom@entreprise.fr.",
      }),
    ),
  addressLine: requiredText("l'adresse de livraison"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, { error: "Le code postal compte 5 chiffres." }),
  city: requiredText("la ville", 100),
  message: z
    .string()
    .trim()
    .max(2000, { error: "2 000 caractères maximum." })
    .optional()
    .transform((v) => v || undefined),
  consent: z.literal("on", {
    error: "Votre accord est nécessaire pour traiter la demande.",
  }),
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
