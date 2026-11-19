import { describe, expect, it } from "vitest";
import { SLUG_PATTERN, slugify } from "./slug";

describe("slugify", () => {
  it("reprend les adresses du catalogue", () => {
    expect(slugify("Coca-Cola 1,5 L")).toBe("coca-cola-1-5-l");
    expect(slugify("B'lue 33 cl")).toBe("blue-33-cl");
    expect(slugify("Hawaï")).toBe("hawai");
    expect(slugify("Sodas & Eaux")).toBe("sodas-eaux");
    expect(slugify("Épicerie sucrée")).toBe("epicerie-sucree");
  });

  it("ne garde ni tiret en début ou fin, ni texte vide inutile", () => {
    expect(slugify("  -- Promo ! --")).toBe("promo");
    expect(slugify("!!!")).toBe("");
  });

  it("coupe à la longueur maximale sans tiret final", () => {
    expect(slugify("abc def ghi", 8)).toBe("abc-def");
  });

  it("produit des adresses valides", () => {
    for (const name of [
      "Coca-Cola 1,5 L",
      "Lay's Nature 45 g",
      "Jus d’orange",
    ]) {
      expect(slugify(name)).toMatch(SLUG_PATTERN);
    }
  });
});
