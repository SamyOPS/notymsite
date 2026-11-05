import type { QuoteProduct } from "@/types/catalog";
import type { QuoteLine } from "./lines";

export type QuoteEstimate = {
  /** Nombre de références dans la sélection. */
  lineCount: number;
  /** Nombre total de packs. */
  totalPacks: number;
  /** Somme des prix « à partir de » HT des lignes qui en ont un. */
  pricedTotalCents: number;
  pricedLines: number;
  /** Lignes « sur devis » (pas de prix renseigné). */
  unpricedLines: number;
};

/**
 * Estimation indicative : seuls les prix « à partir de » renseignés sont
 * additionnés. Le prix définitif, la TVA et la livraison figurent sur le devis.
 */
export function estimateQuote(
  lines: readonly QuoteLine[],
  products: ReadonlyMap<string, QuoteProduct>,
): QuoteEstimate {
  const estimate: QuoteEstimate = {
    lineCount: 0,
    totalPacks: 0,
    pricedTotalCents: 0,
    pricedLines: 0,
    unpricedLines: 0,
  };
  for (const line of lines) {
    const product = products.get(line.productId);
    if (!product) continue;
    estimate.lineCount += 1;
    estimate.totalPacks += line.quantity;
    if (product.priceFromHtCents === null) {
      estimate.unpricedLines += 1;
    } else {
      estimate.pricedLines += 1;
      estimate.pricedTotalCents += product.priceFromHtCents * line.quantity;
    }
  }
  return estimate;
}
