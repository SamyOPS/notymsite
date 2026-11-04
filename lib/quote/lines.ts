/** Lignes de la demande de devis (logique pure, sans accès au navigateur). */

export type QuoteLine = { productId: string; quantity: number };

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 999;

export function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return MIN_QUANTITY;
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.trunc(quantity)));
}

/** Ajoute une quantité à un produit, ou crée la ligne s'il est absent. */
export function addLine(
  lines: readonly QuoteLine[],
  productId: string,
  quantity = 1,
): QuoteLine[] {
  const existing = lines.find((l) => l.productId === productId);
  if (!existing)
    return [...lines, { productId, quantity: clampQuantity(quantity) }];
  return lines.map((l) =>
    l.productId === productId
      ? { ...l, quantity: clampQuantity(l.quantity + quantity) }
      : l,
  );
}

export function setLineQuantity(
  lines: readonly QuoteLine[],
  productId: string,
  quantity: number,
): QuoteLine[] {
  return lines.map((l) =>
    l.productId === productId ? { ...l, quantity: clampQuantity(quantity) } : l,
  );
}

export function removeLine(
  lines: readonly QuoteLine[],
  productId: string,
): QuoteLine[] {
  return lines.filter((l) => l.productId !== productId);
}

/** Valide des données lues depuis le stockage local (potentiellement corrompues). */
export function parseLines(raw: unknown): QuoteLine[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const lines: QuoteLine[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const { productId, quantity } = item as Record<string, unknown>;
    if (
      typeof productId !== "string" ||
      productId === "" ||
      seen.has(productId)
    )
      continue;
    if (typeof quantity !== "number") continue;
    seen.add(productId);
    lines.push({ productId, quantity: clampQuantity(quantity) });
  }
  return lines;
}
