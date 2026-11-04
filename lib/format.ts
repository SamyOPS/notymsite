const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

/** Formate un montant en centimes : 1290 → « 12,90 € ». */
export function formatPrice(cents: number): string {
  return euro.format(cents / 100);
}

/** Prix d'une unité à partir du prix du pack, arrondi au centime. */
export function unitPriceCents(
  packPriceCents: number,
  unitsPerPack: number,
): number {
  if (!Number.isInteger(unitsPerPack) || unitsPerPack <= 0) {
    throw new Error(`Nombre d'unités invalide : ${unitsPerPack}`);
  }
  return Math.round(packPriceCents / unitsPerPack);
}

/** « Pack de 24 canettes » + « 33 cl » → « Pack de 24 canettes · 33 cl ». */
export function packagingLabel(
  packLabel: string,
  volume: string | null,
): string {
  return volume ? `${packLabel} · ${volume}` : packLabel;
}
