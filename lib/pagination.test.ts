import { describe, expect, it } from "vitest";
import { pageHref, paginationRange } from "./pagination";

describe("paginationRange", () => {
  it("affiche toutes les pages quand il y en a peu", () => {
    expect(paginationRange(1, 1)).toEqual([1]);
    expect(paginationRange(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("remplace les grands trous par des ellipses", () => {
    expect(paginationRange(6, 12)).toEqual([
      1,
      "ellipsis",
      5,
      6,
      7,
      "ellipsis",
      12,
    ]);
    expect(paginationRange(1, 12)).toEqual([1, 2, "ellipsis", 12]);
    expect(paginationRange(12, 12)).toEqual([1, "ellipsis", 11, 12]);
  });

  it("affiche la page plutôt qu'une ellipse pour un trou d'une seule page", () => {
    expect(paginationRange(4, 12)).toEqual([1, 2, 3, 4, 5, "ellipsis", 12]);
  });

  it("borne une page hors limites", () => {
    expect(paginationRange(99, 5)).toEqual([1, "ellipsis", 4, 5]);
  });
});

describe("pageHref", () => {
  it("conserve les filtres et remplace la page", () => {
    expect(
      pageHref(
        "/catalogue",
        { marque: ["coca-cola", "pepsi"], page: "3", tri: "nom" },
        4,
      ),
    ).toBe("/catalogue?marque=coca-cola&marque=pepsi&tri=nom&page=4");
  });

  it("omet le paramètre pour la première page", () => {
    expect(pageHref("/catalogue", { page: "2" }, 1)).toBe("/catalogue");
  });
});
