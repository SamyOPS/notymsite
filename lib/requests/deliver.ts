import "server-only";
import type { ContactRequest } from "@/lib/validation/contact-request";

export type DeliveryResult =
  { ok: true } | { ok: false; reason: "unavailable" | "failed" };

/**
 * Transmet une demande de devis ou de contact à l'équipe Notym.
 *
 * Aucun canal n'est encore branché (base de données et e-mail à venir) :
 * - en développement, la demande est affichée dans la console du serveur ;
 * - en production, on renvoie « unavailable » pour ne jamais faire croire au
 *   visiteur que sa demande est partie alors qu'elle serait perdue.
 */
export async function deliverContactRequest(
  request: ContactRequest,
): Promise<DeliveryResult> {
  if (process.env.NODE_ENV !== "production") {
    console.info("[demande reçue — aucun canal d'envoi branché]", {
      ...request,
      receivedAt: new Date().toISOString(),
    });
    return { ok: true };
  }
  return { ok: false, reason: "unavailable" };
}
