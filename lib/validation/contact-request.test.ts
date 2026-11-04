import { describe, expect, it } from "vitest";
import { z } from "zod";
import { contactRequestSchema } from "./contact-request";

const valid = {
  kind: "devis",
  establishmentType: "epicerie",
  companyName: "Épicerie de démonstration",
  siret: "980 484 190 00023",
  contactName: "Prénom Nom",
  phone: "07 66 98 09 11",
  email: "contact@exemple.fr",
  addressLine: "1 rue de l'Exemple",
  postalCode: "60160",
  city: "Montataire",
  message: "",
  consent: "on",
};

function errorsFor(input: Record<string, unknown>) {
  const result = contactRequestSchema.safeParse(input);
  return result.success ? {} : z.flattenError(result.error).fieldErrors;
}

describe("contactRequestSchema", () => {
  it("accepte une demande complète et normalise SIRET et téléphone", () => {
    const result = contactRequestSchema.parse(valid);
    expect(result.siret).toBe("98048419000023");
    expect(result.phone).toBe("0766980911");
    expect(result.message).toBeUndefined();
  });

  it("accepte un numéro au format international", () => {
    expect(
      errorsFor({ ...valid, phone: "+33 7 66 98 09 11" }).phone,
    ).toBeUndefined();
  });

  it("signale un SIRET trop court puis une clé invalide", () => {
    expect(errorsFor({ ...valid, siret: "123" }).siret).toEqual([
      "Le SIRET compte 14 chiffres.",
    ]);
    expect(errorsFor({ ...valid, siret: "98048419000024" }).siret).toEqual([
      "Ce numéro SIRET n'est pas valide. Vérifiez les chiffres.",
    ]);
  });

  it("exige le consentement et les champs obligatoires", () => {
    const errors = errorsFor({
      ...valid,
      consent: undefined,
      companyName: " ",
      city: "",
    });
    expect(errors.consent).toBeDefined();
    expect(errors.companyName).toEqual(["Indiquez la raison sociale."]);
    expect(errors.city).toEqual(["Indiquez la ville."]);
  });

  it("refuse un e-mail, un code postal ou un type d'établissement invalides", () => {
    const errors = errorsFor({
      ...valid,
      email: "pas-un-email",
      postalCode: "6016",
      establishmentType: "banque",
    });
    expect(errors.email).toBeDefined();
    expect(errors.postalCode).toEqual(["Le code postal compte 5 chiffres."]);
    expect(errors.establishmentType).toBeDefined();
  });
});
