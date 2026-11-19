import { describe, expect, it } from "vitest";
import { safeNextPath } from "./next-path";

describe("safeNextPath", () => {
  it("accepte les pages de l'admin", () => {
    expect(safeNextPath("/admin")).toBe("/admin");
    expect(safeNextPath("/admin/produits?q=coca")).toBe(
      "/admin/produits?q=coca",
    );
  });

  it("refuse tout le reste", () => {
    for (const value of [
      undefined,
      "",
      "/",
      "/catalogue",
      "/administration",
      "https://exemple.com/admin",
      "//exemple.com/admin",
      "/admin//exemple.com",
      "/admin\\..\\",
      "/admin/connexion",
    ]) {
      expect(safeNextPath(value)).toBe("/admin");
    }
  });
});
