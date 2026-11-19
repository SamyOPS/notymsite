import { describe, expect, it } from "vitest";
import { formatLongDate, toParagraphs } from "./text";

describe("toParagraphs", () => {
  it("sépare les paragraphes sur les lignes vides", () => {
    expect(
      toParagraphs("Premier.\n\nDeuxième\nsuite.\r\n\r\n\n  Troisième  "),
    ).toEqual([["Premier."], ["Deuxième", "suite."], ["Troisième"]]);
  });

  it("ignore un texte vide", () => {
    expect(toParagraphs("  \n\n ")).toEqual([]);
  });
});

describe("formatLongDate", () => {
  it("affiche la date en français, à l'heure de Paris", () => {
    expect(formatLongDate("2026-11-18T23:30:00Z")).toBe("19 novembre 2026");
  });
});
