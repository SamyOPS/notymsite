"use server";

import { z } from "zod";
import { getQuoteProducts } from "@/lib/catalog/queries";
import type { QuoteLine } from "@/lib/quote/lines";
import { deliverRequest } from "@/lib/requests/deliver";
import { createReference } from "@/lib/requests/reference";
import {
  quoteSubmissionSchema,
  type QuoteDetailsField,
} from "@/lib/validation/quote-request";
import type { QuoteProduct } from "@/types/catalog";

const idsSchema = z.array(z.string().min(1).max(100)).max(100);

/** Détails des produits d'une sélection (lecture seule, pour l'affichage du devis). */
export async function loadQuoteProducts(
  ids: string[],
): Promise<QuoteProduct[]> {
  const parsed = idsSchema.safeParse(ids);
  if (!parsed.success) return [];
  return getQuoteProducts([...new Set(parsed.data)].sort());
}

export type QuotePayload = {
  details: Partial<Record<QuoteDetailsField, string>>;
  lines: QuoteLine[];
  consent?: string;
  website?: string;
};

export type QuoteErrorField = QuoteDetailsField | "consent" | "lines";

export type QuoteSubmitResult =
  | {
      status: "invalid";
      step: 1 | 2 | 3;
      errors: Partial<Record<QuoteErrorField, string>>;
    }
  | { status: "unavailable" }
  | { status: "success"; reference?: string };

/** Envoie la demande de devis. Tout est revalidé ici : le navigateur n'est pas une source fiable. */
export async function submitQuoteRequest(
  payload: QuotePayload,
): Promise<QuoteSubmitResult> {
  // Pot de miel rempli : robot. Réponse neutre, rien n'est transmis.
  if (payload.website) return { status: "success" };

  const parsed = quoteSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    const errors: Partial<Record<QuoteErrorField, string>> = {};
    let step: 1 | 2 | 3 = 3;
    for (const issue of parsed.error.issues) {
      const [root, field] = issue.path;
      if (root === "lines") {
        errors.lines ??= issue.message;
        step = 1;
      } else if (root === "details" && typeof field === "string") {
        errors[field as QuoteDetailsField] ??= issue.message;
        if (step !== 1) step = 2;
      } else if (root === "consent") {
        errors.consent ??= issue.message;
      }
    }
    return { status: "invalid", step, errors };
  }

  const { details, lines } = parsed.data;
  const products = new Map(
    (await getQuoteProducts(lines.map((l) => l.productId))).map((p) => [
      p.id,
      p,
    ]),
  );
  if (lines.some((line) => !products.has(line.productId))) {
    return {
      status: "invalid",
      step: 1,
      errors: {
        lines:
          "Certains produits ne sont plus disponibles. Vérifiez votre sélection.",
      },
    };
  }

  const reference = createReference("D");
  const result = await deliverRequest({
    type: "devis",
    reference,
    receivedAt: new Date().toISOString(),
    data: details,
    lines: lines.map((line) => {
      const product = products.get(line.productId)!;
      return {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        packLabel: product.packLabel,
        quantity: line.quantity,
        priceFromHtCents: product.priceFromHtCents,
      };
    }),
  });
  if (!result.ok) return { status: "unavailable" };
  return { status: "success", reference };
}
