import { describe, expect, it } from "vitest";
import type { QuoteProduct } from "@/types/catalog";
import { estimateQuote } from "./estimate";

const product = (
  id: string,
  priceFromHtCents: number | null,
): QuoteProduct => ({
  id,
  slug: id,
  name: id,
  brand: "Marque",
  packLabel: "Pack de 24",
  volume: "33 cl",
  imageUrl: null,
  badges: [],
  inStock: true,
  priceFromHtCents,
  unitsPerPack: 24,
});

const catalog = new Map([
  ["a", product("a", 1000)],
  ["b", product("b", 250)],
  ["c", product("c", null)],
]);

describe("estimateQuote", () => {
  it("additionne seulement les lignes qui ont un prix", () => {
    expect(
      estimateQuote(
        [
          { productId: "a", quantity: 2 },
          { productId: "b", quantity: 4 },
          { productId: "c", quantity: 5 },
        ],
        catalog,
      ),
    ).toEqual({
      lineCount: 3,
      totalPacks: 11,
      pricedTotalCents: 3000,
      pricedLines: 2,
      unpricedLines: 1,
    });
  });

  it("ignore les produits inconnus (retirés du catalogue)", () => {
    expect(estimateQuote([{ productId: "zzz", quantity: 3 }], catalog)).toEqual(
      {
        lineCount: 0,
        totalPacks: 0,
        pricedTotalCents: 0,
        pricedLines: 0,
        unpricedLines: 0,
      },
    );
  });
});
