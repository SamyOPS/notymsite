import { describe, expect, it } from "vitest";
import { isValidSiret, normalizeSiret } from "./siret";

describe("isValidSiret", () => {
  it("accepte un SIRET réel, avec ou sans espaces", () => {
    // SIRET de Notym, publié dans ses mentions légales
    expect(isValidSiret("98048419000023")).toBe(true);
    expect(isValidSiret("980 484 190 00023")).toBe(true);
  });

  it("refuse une clé de Luhn incorrecte", () => {
    expect(isValidSiret("98048419000024")).toBe(false);
  });

  it("refuse une longueur différente de 14 chiffres ou des lettres", () => {
    expect(isValidSiret("980484190")).toBe(false);
    expect(isValidSiret("980484190000230")).toBe(false);
    expect(isValidSiret("9804841900002A")).toBe(false);
    expect(isValidSiret("")).toBe(false);
  });

  it("applique la règle spécifique de La Poste", () => {
    expect(isValidSiret("35600000049837")).toBe(true); // somme = 45
    expect(isValidSiret("35600000049838")).toBe(false); // somme = 46
  });
});

describe("normalizeSiret", () => {
  it("retire espaces et points", () => {
    expect(normalizeSiret("980.484.190 00023")).toBe("98048419000023");
  });
});
