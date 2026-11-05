import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("garde une taille et une couleur de texte personnalisées", () => {
    expect(cn("text-h1", "text-ink")).toBe("text-h1 text-ink");
    expect(cn("text-price", "text-wheat-ink")).toBe(
      "text-price text-wheat-ink",
    );
  });

  it("résout les conflits entre deux tokens du même groupe", () => {
    expect(cn("bg-surface", "bg-teal-soft")).toBe("bg-teal-soft");
  });
});
