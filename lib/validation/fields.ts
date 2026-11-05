import { z } from "zod";
import { isValidSiret, normalizeSiret } from "./siret";

/** Règles de validation communes aux formulaires « Devenir client » et « Devis ». */

export const establishmentTypes = [
  { value: "epicerie", label: "Épicerie" },
  { value: "cafe-bar", label: "Café / Bar" },
  { value: "restaurant", label: "Restaurant" },
  { value: "grande-surface", label: "Grande surface" },
  { value: "autre", label: "Autre" },
] as const;

type Values<T extends ReadonlyArray<{ value: string }>> = T[number]["value"];

/** Valeurs d'une liste d'options, au format attendu par z.enum. */
export function optionValues<T extends ReadonlyArray<{ value: string }>>(
  options: T,
) {
  return options.map((o) => o.value) as [Values<T>, ...Values<T>[]];
}

/** Numéro français : 0X XX XX XX XX, +33 X XX XX XX XX ou 0033… */
const FRENCH_PHONE = /^(?:(?:\+|00)33|0)[1-9]\d{8}$/;

export function normalizePhone(value: string): string {
  return value.replace(/[\s.\-()]/g, "");
}

export const requiredText = (label: string, max = 200) =>
  z
    .string()
    .trim()
    .min(1, { error: `Indiquez ${label}.` })
    .max(max, { error: `${max} caractères maximum.` });

export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `${max.toLocaleString("fr-FR")} caractères maximum.` })
    .optional()
    .transform((v) => v || undefined);

export const fields = {
  establishmentType: z.enum(optionValues(establishmentTypes), {
    error: "Choisissez votre type d'établissement.",
  }),
  companyName: requiredText("la raison sociale"),
  siret: z
    .string()
    .trim()
    .transform(normalizeSiret)
    // Un seul message à la fois, sans « abort » : un abort empêcherait les
    // contrôles de niveau formulaire (adresse obligatoire en livraison…)
    // de s'exécuter, et l'utilisateur découvrirait ses erreurs en plusieurs fois.
    .superRefine((value, ctx) => {
      if (!/^\d{14}$/.test(value)) {
        ctx.addIssue({
          code: "custom",
          message: "Le SIRET compte 14 chiffres.",
        });
      } else if (!isValidSiret(value)) {
        ctx.addIssue({
          code: "custom",
          message: "Ce numéro SIRET n'est pas valide. Vérifiez les chiffres.",
        });
      }
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
  message: optionalText(2000),
  consent: z.literal("on", {
    error: "Votre accord est nécessaire pour traiter la demande.",
  }),
};

/** Premier message d'erreur par champ, à partir d'une erreur zod. */
export function firstErrors<K extends string>(
  error: z.ZodError,
): Partial<Record<K, string>> {
  const fieldErrors = z.flattenError(error).fieldErrors as Partial<
    Record<K, string[]>
  >;
  const errors: Partial<Record<K, string>> = {};
  for (const [field, messages] of Object.entries(fieldErrors) as Array<
    [K, string[] | undefined]
  >) {
    if (messages?.[0]) errors[field] = messages[0];
  }
  return errors;
}
