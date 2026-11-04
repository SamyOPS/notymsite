import { describe, expect, it } from "vitest";
import { formatPrice, packagingLabel, unitPriceCents } from "./format";

// Intl insère des espaces insécables : on les normalise pour comparer.
const plain = (s: string) => s.replace(/[  ]/g, " ");

describe("formatPrice", () => {
  it("formate les centimes en euros à la française", () => {
    expect(plain(formatPrice(1290))).toBe("12,90 €");
    expect(plain(formatPrice(0))).toBe("0,00 €");
    expect(plain(formatPrice(123456))).toBe("1 234,56 €");
  });
});

describe("unitPriceCents", () => {
  it("divise le prix du pack et arrondit au centime", () => {
    expect(unitPriceCents(1290, 24)).toBe(54);
    expect(unitPriceCents(1000, 3)).toBe(333);
  });

  it("refuse un nombre d'unités nul ou non entier", () => {
    expect(() => unitPriceCents(1000, 0)).toThrow();
    expect(() => unitPriceCents(1000, 1.5)).toThrow();
  });
});

describe("packagingLabel", () => {
  it("ajoute la contenance quand elle existe", () => {
    expect(packagingLabel("Pack de 24 canettes", "33 cl")).toBe(
      "Pack de 24 canettes · 33 cl",
    );
    expect(packagingLabel("Carton de 30 sachets", null)).toBe(
      "Carton de 30 sachets",
    );
  });
});
