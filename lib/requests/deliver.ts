import "server-only";
import { createSecretClient } from "@/lib/supabase/secret";
import type { ContactRequest } from "@/lib/validation/contact-request";
import type { Json } from "@/types/database";
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
 * Transmet une demande (contact ou devis) à l'équipe Notym : elle est
 * enregistrée dans Supabase et apparaît dans l'admin (/admin/demandes).
 *
 * Sans clé secrète configurée :
 * - en développement, la demande est affichée dans la console du serveur ;
 * - en production, on renvoie « unavailable » pour ne jamais faire croire au
 *   visiteur que sa demande est partie alors qu'elle serait perdue.
 */
export async function deliverRequest(
  request: OutgoingRequest,
): Promise<DeliveryResult> {
  const supabase = createSecretClient();
  if (!supabase) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[demande ${request.reference} — SUPABASE_SECRET_KEY absente, rien n'est enregistré]`,
        request,
      );
      return { ok: true };
    }
    return { ok: false, reason: "unavailable" };
  }

  const { error } = await supabase.from("requests").insert({
    reference: request.reference,
    type: request.type,
    received_at: request.receivedAt,
    company_name: request.data.companyName,
    contact_name: request.data.contactName,
    email: request.data.email,
    phone: request.data.phone,
    details: toJson(request.data),
    lines: request.type === "devis" ? toJson(request.lines) : [],
  });
  if (error) {
    console.error(
      `[demande ${request.reference}] enregistrement impossible`,
      error,
    );
    return { ok: false, reason: "failed" };
  }
  return { ok: true };
}

/** Objet validé → JSON (les champs facultatifs absents sont omis). */
function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}
