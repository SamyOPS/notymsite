import { describe, expect, it } from "vitest";
import { parseLabel, type LabelContext } from "./label";

const drink: LabelContext = { isBeverage: true, isAlcohol: false };
const alcohol: LabelContext = { isBeverage: true, isAlcohol: true };
const food: LabelContext = {
  isBeverage: false,
  isAlcohol: false,
  isFood: true,
};
const other: LabelContext = { isBeverage: false, isAlcohol: false };

const pick = (raw: string, context: LabelContext) => {
  const p = parseLabel(raw, context);
  return [p.name, p.brand, p.volume, p.unitsPerPack, p.packLabel];
};

describe("parseLabel", () => {
  it("reconnaît les conditionnements courants", () => {
    expect(pick("COCA COLA ORIGINAL IMPORT 24 x 33CL", drink)).toEqual([
      "Coca-Cola Original Import 33 cl",
      "Coca-Cola",
      "33 cl",
      24,
      "Pack de 24",
    ]);
    expect(pick("COCA COLA ORIGINAL 9 x 1.5L", drink)).toEqual([
      "Coca-Cola Original 1,5 L",
      "Coca-Cola",
      "1,5 L",
      9,
      "Pack de 9",
    ]);
    expect(pick("EVIAN 1LX6 ", drink)).toEqual([
      "Evian 1 L",
      "Evian",
      "1 L",
      6,
      "Pack de 6",
    ]);
    expect(pick("VITTEL 1L5X6", drink)).toEqual([
      "Vittel 1,5 L",
      "Vittel",
      "1,5 L",
      6,
      "Pack de 6",
    ]);
    expect(pick("SPRITE 1.25X6", drink)).toEqual([
      "Sprite 1,25 L",
      "Sprite",
      "1,25 L",
      6,
      "Pack de 6",
    ]);
    expect(pick("COCA COLA VANILLE CHINE 33X12", drink)).toEqual([
      "Coca-Cola Vanille Chine 33 cl",
      "Coca-Cola",
      "33 cl",
      12,
      "Pack de 12",
    ]);
  });

  it("multiplie les conditionnements imbriqués", () => {
    expect(pick("BRIK JUS DE POMME BF (6x20CL) x 4", drink)).toEqual([
      "Brik Jus de Pomme 20 cl",
      "Belle France",
      "20 cl",
      24,
      "Pack de 24",
    ]);
    expect(pick("CAPRISUN MULTIVITAMINEE (10 x 4) x 20CL", drink)).toEqual([
      "Capri-Sun Multivitaminée 20 cl",
      "Capri-Sun",
      "20 cl",
      40,
      "Pack de 40",
    ]);
  });

  it("place la contenance en fin de nom et accentue", () => {
    expect(pick("PATES TORTI 12 x 500G PANZANI", food)).toEqual([
      "Pâtes Torti Panzani 500 g",
      "Panzani",
      "500 g",
      12,
      "Carton de 12",
    ]);
    expect(pick("BRIK SOUPE 8 LEGUMES VELOUTE BF 6 x 1L", food)[0]).toBe(
      "Brik Soupe 8 Légumes Velouté 1 L",
    );
  });

  it("gère les lots, l'unité et les poids sans unité en épicerie", () => {
    expect(pick("JUMBOS FRAISE ACIDES 30 PCS", food)).toEqual([
      "Jumbos Fraise Acides",
      null,
      null,
      30,
      "Lot de 30",
    ]);
    expect(pick("KINDER SURPRISE 1PCS", food)).toEqual([
      "Kinder Surprise",
      "Kinder",
      null,
      1,
      "À l'unité",
    ]);
    expect(pick("NOIX CAJOU SANS SEL SACHET 125X12 BF", food)).toEqual([
      "Noix Cajou sans Sel Sachet 125 g",
      "Belle France",
      "125 g",
      12,
      "Carton de 12",
    ]);
    expect(pick("SAC POUBELLE BF (20PCS x 20L) 1PCS", other)[0]).toBe(
      "Sac Poubelle 20 L",
    );
  });

  it("met les spiritueux à l'unité et les rosés au masculin", () => {
    expect(pick("WHISKY JACK DANIEL'S 40° / 70CL", alcohol)).toEqual([
      "Whisky Jack Daniel's 40° 70 cl",
      "Jack Daniel's",
      "70 cl",
      1,
      "À l'unité",
    ]);
    expect(pick("VIN TABLE ROSE 6 x 1.5L", alcohol)[0]).toBe(
      "Vin Table Rosé 1,5 L",
    );
    expect(pick("SKOLL TUBORG 3X33", alcohol)).toEqual([
      "Skoll Tuborg 33 cl",
      "Skoll",
      "33 cl",
      3,
      "Pack de 3",
    ]);
  });

  it("ne confond pas les marques proches", () => {
    expect(pick("MONSTER MUNCH SALÉ 135G X 12", food)[1]).toBe("Monster Munch");
    expect(pick("MONSTER ENERGY ORIGINAL 24 x 50CL", drink)[1]).toBe("Monster");
    expect(pick("JUMBOS COLA  ACIDES 30 PCS", food)[1]).toBeNull();
    expect(pick("JUMBO BOUILLON POULET 1KG", food)[1]).toBe("Jumbo");
    expect(pick("CHIPS NATURE LAYS 20 x 45G", food)[0]).toBe(
      "Chips Nature Lay's 45 g",
    );
  });

  it("signale ce qu'il ne sait pas lire, sans rien perdre du libellé", () => {
    const p = parseLabel("GAILLAC ROUGE 3 ORMEAUX", alcohol);
    expect(p.name).toBe("Gaillac Rouge 3 Ormeaux");
    expect(p.warnings).toContain("conditionnement non reconnu");
  });
});
