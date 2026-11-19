import { requestKinds } from "@/lib/validation/contact-request";
import { establishmentTypes } from "@/lib/validation/fields";
import { receptionModes } from "@/lib/validation/quote-request";
import { requestStatuses } from "./schemas";

/** Libellés affichés dans l'admin pour les valeurs enregistrées. */

const find = (
  options: ReadonlyArray<{ value: string; label: string }>,
  value: unknown,
) => options.find((o) => o.value === value)?.label;

export function statusLabel(status: string): string {
  return find(requestStatuses, status) ?? status;
}

/** Type de demande : devis du catalogue, ou formulaire « Devenir client ». */
export function requestTypeLabel(type: string, kind?: unknown): string {
  if (type === "devis") return "Devis (sélection de produits)";
  const label = find(requestKinds, kind);
  return label ? `Devenir client — ${label.toLowerCase()}` : "Devenir client";
}

export function establishmentLabel(value: unknown): string | undefined {
  return find(establishmentTypes, value);
}

export function receptionLabel(value: unknown): string | undefined {
  return find(receptionModes, value);
}

const dateTime = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

const date = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeZone: "Europe/Paris",
});

export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
export const formatDate = (iso: string) => date.format(new Date(iso));
