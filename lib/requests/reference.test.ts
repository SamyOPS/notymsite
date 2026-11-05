import { describe, expect, it } from "vitest";
import { createReference } from "./reference";

describe("createReference", () => {
  it("compose préfixe, date et suffixe lisible", () => {
    const ref = createReference(
      "D",
      new Date(2026, 10, 5),
      () => new Uint8Array([0, 1, 2, 30]),
    );
    expect(ref).toBe("D-20261105-234Z");
  });

  it("produit des références différentes et sans caractère ambigu", () => {
    const refs = new Set(
      Array.from({ length: 50 }, () => createReference("C")),
    );
    expect(refs.size).toBeGreaterThan(45);
    for (const ref of refs) expect(ref).toMatch(/^C-\d{8}-[2-9A-HJKMNP-Z]{4}$/);
  });
});
