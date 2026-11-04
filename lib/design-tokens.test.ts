import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";

/**
 * Vérifie les contrastes des tokens déclarés dans app/globals.css, pour les
 * deux thèmes. Toute paire texte/fond utilisée par l'interface doit figurer ici.
 */

const css = readFileSync(
  fileURLToPath(new URL("../app/globals.css", import.meta.url)),
  "utf8",
);

function readBlock(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Bloc introuvable : ${selector}`);
  const body = css.slice(start, css.indexOf("}", start));
  const tokens: Record<string, string> = {};
  for (const [, name, value] of body.matchAll(
    /--([a-z-]+):\s*(#[0-9a-f]{6})/gi,
  )) {
    if (name && value) tokens[name] = value;
  }
  return tokens;
}

const light = readBlock(":root {");
const themes = {
  clair: light,
  sombre: { ...light, ...readBlock(':root[data-theme="dark"] {') },
};

// [texte, fond, minimum]
const TEXT = 4.5;
const UI = 3;
const pairs: ReadonlyArray<[string, string, number]> = [
  ["ink", "surface", TEXT],
  ["ink", "surface-raised", TEXT],
  ["ink", "teal-soft", TEXT],
  ["ink-muted", "surface", TEXT],
  ["ink-muted", "surface-raised", TEXT],
  ["ink-muted", "teal-soft", TEXT],
  ["teal-deep", "surface", TEXT],
  ["teal-deep", "surface-raised", TEXT],
  ["teal-deep", "teal-soft", TEXT],
  ["on-teal", "teal-deep", TEXT],
  ["on-inverse", "surface-inverse", TEXT],
  ["on-accent", "teal", TEXT],
  ["on-accent", "wheat", TEXT],
  ["wheat-ink", "wheat-soft", TEXT],
  ["success", "teal-soft", TEXT],
  ["success", "surface-raised", TEXT],
  ["danger", "surface", TEXT],
  ["danger", "surface-raised", TEXT],
  ["danger", "teal-soft", TEXT],
  ["surface", "ink", TEXT], // bouton « dark »
  // Composants d'interface (bordures de champs, anneau de focus)
  ["line-strong", "surface", UI],
  ["line-strong", "surface-raised", UI],
  ["teal-deep", "surface", UI],
];

describe.each(Object.entries(themes))("tokens du thème %s", (_name, tokens) => {
  it.each(pairs)("%s sur %s ≥ %d:1", (fg, bg, min) => {
    const a = tokens[fg];
    const b = tokens[bg];
    expect(a, `token --${fg} manquant`).toBeDefined();
    expect(b, `token --${bg} manquant`).toBeDefined();
    expect(contrastRatio(a!, b!)).toBeGreaterThanOrEqual(min);
  });
});
