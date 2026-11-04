import { describe, expect, it } from "vitest";
import {
  addLine,
  clampQuantity,
  parseLines,
  removeLine,
  setLineQuantity,
} from "./lines";

describe("lignes de devis", () => {
  it("ajoute un produit puis cumule les quantités", () => {
    const once = addLine([], "a");
    expect(once).toEqual([{ productId: "a", quantity: 1 }]);
    expect(addLine(once, "a", 5)).toEqual([{ productId: "a", quantity: 6 }]);
  });

  it("borne les quantités entre 1 et 999", () => {
    expect(clampQuantity(0)).toBe(1);
    expect(clampQuantity(-3)).toBe(1);
    expect(clampQuantity(5000)).toBe(999);
    expect(clampQuantity(2.7)).toBe(2);
    expect(clampQuantity(Number.NaN)).toBe(1);
    expect(addLine([{ productId: "a", quantity: 998 }], "a", 10)).toEqual([
      { productId: "a", quantity: 999 },
    ]);
  });

  it("modifie et supprime une ligne", () => {
    const lines = [
      { productId: "a", quantity: 2 },
      { productId: "b", quantity: 1 },
    ];
    expect(setLineQuantity(lines, "b", 4)).toEqual([
      { productId: "a", quantity: 2 },
      { productId: "b", quantity: 4 },
    ]);
    expect(removeLine(lines, "a")).toEqual([{ productId: "b", quantity: 1 }]);
  });

  it("ignore les données corrompues du stockage local", () => {
    expect(parseLines("n'importe quoi")).toEqual([]);
    expect(
      parseLines([
        { productId: "a", quantity: 3 },
        { productId: "a", quantity: 9 },
        { productId: "", quantity: 1 },
        { productId: "b", quantity: "2" },
        null,
        { productId: "c", quantity: 0 },
      ]),
    ).toEqual([
      { productId: "a", quantity: 3 },
      { productId: "c", quantity: 1 },
    ]);
  });
});
