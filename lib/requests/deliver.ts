import "server-only";
import type { ContactRequest } from "@/lib/validation/contact-request";
import type { QuoteDetails } from "@/lib/validation/quote-request";

export type QuoteLineSnapshot = {
  productId: string;
  slug: string;
  name: string;
  packLabel: string;
  quantity: number;
  /** Prix « à partir de » affiché au moment de la demande (indicatif). */
  priceFromHtCents: number | null;
};

/** Demande prête à être transmise à l'équipe Notym. */
export type OutgoingRequest =
  | {
      type: "contact";
      reference: string;
      receivedAt: string;
      data: ContactRequest;
    }
  | {
      type: "devis";
      reference: string;
      receivedAt: string;
      data: QuoteDetails;
      lines: QuoteLineSnapshot[];
    };

export type DeliveryResult =
  { ok: true } | { ok: false; reason: "unavailable" | "failed" };

/**
 * Transmet une demande (contact ou devis) à l'équipe Notym.
 *
 * Aucun canal n'est encore branché (base de données et e-mail à venir) :
 * - en développement, la demande est affichée dans la console du serveur ;
 * - en production, on renvoie « unavailable » pour ne jamais faire croire au
 *   visiteur que sa demande est partie alors qu'elle serait perdue.
 */
export async function deliverRequest(
  request: OutgoingRequest,
): Promise<DeliveryResult> {
  if (process.env.NODE_ENV !== "production") {
    console.info(
      `[demande ${request.reference} — aucun canal d'envoi branché]`,
      request,
    );
    return { ok: true };
  }
  return { ok: false, reason: "unavailable" };
}
