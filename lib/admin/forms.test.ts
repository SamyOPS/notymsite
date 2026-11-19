import { describe, expect, it } from "vitest";
import { dbErrorMessage, isInUseError, readForm } from "./forms";

describe("readForm", () => {
  it("lit les champs texte et les listes", () => {
    const data = new FormData();
    data.set("name", "Coca-Cola");
    data.append("images", "/products/a.webp");
    data.append("images", "/products/b.webp");
    data.set("$ACTION_ID_abc", "");
    expect(readForm(data, ["images", "autres"])).toEqual({
      name: "Coca-Cola",
      images: ["/products/a.webp", "/products/b.webp"],
      autres: [],
    });
  });
});

describe("dbErrorMessage", () => {
  it("nomme le champ en double", () => {
    expect(
      dbErrorMessage(
        {
          code: "23505",
          message:
            'duplicate key value violates unique constraint "products_sku_key"',
        },
        { slug: "Adresse prise.", sku: "Référence prise." },
      ),
    ).toBe("Référence prise.");
  });

  it("reprend les messages rédigés dans la base", () => {
    expect(
      dbErrorMessage({
        code: "23514",
        message: "Le parent doit être un univers (premier niveau).",
      }),
    ).toBe("Le parent doit être un univers (premier niveau).");
    expect(
      dbErrorMessage({
        code: "23514",
        message: 'new row violates check constraint "brands_slug_check"',
      }),
    ).toBe("L'enregistrement a échoué. Réessayez dans un instant.");
  });

  it("reconnaît une suppression bloquée (restrict ou no action)", () => {
    expect(isInUseError({ code: "23001" })).toBe(true);
    expect(isInUseError({ code: "23503" })).toBe(true);
    expect(isInUseError(null)).toBe(false);
  });
});
