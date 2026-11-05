import { z } from "zod";
import { MAX_QUANTITY, MIN_QUANTITY } from "@/lib/quote/lines";
import { fields, optionalText, optionValues } from "./fields";

export const receptionModes = [
  { value: "livraison", label: "Livraison" },
  { value: "retrait", label: "Retrait au dépôt" },
] as const;

const optionalAddress = z
  .string()
  .trim()
  .max(200, { error: "200 caractères maximum." })
  .optional()
  .transform((v) => v || undefined);

/**
 * Coordonnées et mode de réception (étape 2 du devis). L'adresse n'est
 * exigée que pour une livraison.
 */
export const quoteDetailsSchema = z
  .object({
    receptionMode: z.enum(optionValues(receptionModes), {
      error: "Choisissez la livraison ou le retrait au dépôt.",
    }),
    establishmentType: fields.establishmentType,
    companyName: fields.companyName,
    siret: fields.siret,
    contactName: fields.contactName,
    phone: fields.phone,
    email: fields.email,
    addressLine: optionalAddress,
    postalCode: optionalAddress,
    city: optionalAddress,
    message: fields.message,
    discountCode: optionalText(50),
  })
  .superRefine(
    (value, ctx) => {
      // Exécuté même si d'autres champs sont invalides (option `when`), pour
      // signaler toutes les erreurs en une fois : les valeurs ne sont donc
      // pas garanties ici et sont relues prudemment.
      const v = value as Partial<Record<string, unknown>>;
      const text = (key: string) =>
        typeof v[key] === "string" ? (v[key] as string).trim() : "";
      const needsAddress = v.receptionMode === "livraison";
      if (needsAddress && !text("addressLine")) {
        ctx.addIssue({
          code: "custom",
          path: ["addressLine"],
          message: "Indiquez l'adresse de livraison.",
        });
      }
      if (needsAddress && !text("city")) {
        ctx.addIssue({
          code: "custom",
          path: ["city"],
          message: "Indiquez la ville.",
        });
      }
      const postalCode = text("postalCode");
      if ((needsAddress || postalCode) && !/^\d{5}$/.test(postalCode)) {
        ctx.addIssue({
          code: "custom",
          path: ["postalCode"],
          message: "Le code postal compte 5 chiffres.",
        });
      }
    },
    { when: () => true },
  )
  .transform((value) =>
    // En retrait, l'adresse n'est pas transmise.
    value.receptionMode === "retrait"
      ? {
          ...value,
          addressLine: undefined,
          postalCode: undefined,
          city: undefined,
        }
      : value,
  );

export type QuoteDetails = z.infer<typeof quoteDetailsSchema>;
export type QuoteDetailsField = keyof z.input<typeof quoteDetailsSchema>;

export const quoteDetailsTextFields = [
  "receptionMode",
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
  "discountCode",
] as const satisfies ReadonlyArray<QuoteDetailsField>;

export const quoteLinesSchema = z
  .array(
    z.object({
      productId: z.string().min(1).max(100),
      quantity: z.number().int().min(MIN_QUANTITY).max(MAX_QUANTITY),
    }),
  )
  .min(1, { error: "Votre devis est vide." })
  .max(100, { error: "100 produits maximum par demande." });

/** Demande complète envoyée à l'étape 3. */
export const quoteSubmissionSchema = z.object({
  details: quoteDetailsSchema,
  lines: quoteLinesSchema,
  consent: fields.consent,
});

export type QuoteSubmission = z.infer<typeof quoteSubmissionSchema>;
