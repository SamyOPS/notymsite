import { describe, expect, it } from "vitest";
import { isKnownCatalogPath } from "./routing";

describe("isKnownCatalogPath", () => {
  it("reconnaît les produits et catégories existants", () => {
    expect(isKnownCatalogPath("/produit/red-bull-25-cl-x24")).toBe(true);
    expect(isKnownCatalogPath("/catalogue/sodas-eaux")).toBe(true);
    expect(isKnownCatalogPath("/catalogue/sodas-eaux/")).toBe(true);
  });

  it("rejette les slugs inconnus", () => {
    expect(isKnownCatalogPath("/produit/inconnu")).toBe(false);
    expect(isKnownCatalogPath("/catalogue/inconnue")).toBe(false);
  });

  it("laisse passer les autres chemins", () => {
    expect(isKnownCatalogPath("/catalogue")).toBe(true);
    expect(isKnownCatalogPath("/services")).toBe(true);
  });
});
