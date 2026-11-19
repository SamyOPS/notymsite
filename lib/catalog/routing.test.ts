import { describe, expect, it } from "vitest";
import { checkPath, parseCheckedPath, type KnownPaths } from "./routing";

const known: KnownPaths = {
  products: new Set(["red-bull-25-cl-x24"]),
  categories: new Set(["sodas-eaux"]),
  articles: new Set(["arrivage-novembre"]),
  legacyProducts: new Map([[6, "red-bull-25-cl-x24"]]),
};

const check = (pathname: string) =>
  checkPath(parseCheckedPath(pathname), known);

describe("checkPath", () => {
  it("accepte les produits, catégories et articles existants", () => {
    expect(check("/produit/red-bull-25-cl-x24")).toEqual({ kind: "ok" });
    expect(check("/catalogue/sodas-eaux")).toEqual({ kind: "ok" });
    expect(check("/catalogue/sodas-eaux/")).toEqual({ kind: "ok" });
    expect(check("/actualites/arrivage-novembre")).toEqual({ kind: "ok" });
  });

  it("signale les adresses inconnues", () => {
    expect(check("/produit/inconnu")).toEqual({ kind: "not-found" });
    expect(check("/catalogue/inconnue")).toEqual({ kind: "not-found" });
    expect(check("/actualites/inconnu")).toEqual({ kind: "not-found" });
  });

  it("redirige les anciennes adresses produit", () => {
    expect(check("/product/6")).toEqual({
      kind: "redirect",
      location: "/produit/red-bull-25-cl-x24",
    });
    expect(check("/product/999")).toEqual({ kind: "ok" });
  });

  it("ignore les autres pages", () => {
    expect(check("/catalogue")).toEqual({ kind: "ok" });
    expect(check("/actualites")).toEqual({ kind: "ok" });
    expect(check("/services")).toEqual({ kind: "ok" });
  });

  it("résiste à un encodage invalide", () => {
    expect(check("/produit/%E0%A4%A")).toEqual({ kind: "not-found" });
  });
});
