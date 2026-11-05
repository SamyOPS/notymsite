import { describe, expect, it } from "vitest";
import { firstErrors } from "./fields";
import { quoteDetailsSchema, quoteSubmissionSchema } from "./quote-request";

const details = {
  receptionMode: "livraison",
  establishmentType: "cafe-bar",
  companyName: "Café de démonstration",
  siret: "98048419000023",
  contactName: "Prénom Nom",
  phone: "06 12 34 56 78",
  email: "contact@exemple.fr",
  addressLine: "1 rue de l'Exemple",
  postalCode: "60160",
  city: "Montataire",
  message: "",
  discountCode: "",
};

function errorsFor(input: Record<string, unknown>) {
  const result = quoteDetailsSchema.safeParse(input);
  return result.success ? {} : firstErrors<string>(result.error);
}

describe("quoteDetailsSchema", () => {
  it("exige l'adresse pour une livraison", () => {
    const errors = errorsFor({
      ...details,
      addressLine: "",
      postalCode: "",
      city: "",
    });
    expect(errors).toEqual({
      addressLine: "Indiquez l'adresse de livraison.",
      postalCode: "Le code postal compte 5 chiffres.",
      city: "Indiquez la ville.",
    });
  });

  it("n'exige pas d'adresse pour un retrait, et ne la transmet pas", () => {
    const result = quoteDetailsSchema.parse({
      ...details,
      receptionMode: "retrait",
      addressLine: "ne doit pas partir",
      city: "",
    });
    expect(result.addressLine).toBeUndefined();
    expect(result.postalCode).toBeUndefined();
    expect(result.discountCode).toBeUndefined();
  });

  it("refuse un mode de réception inconnu", () => {
    expect(
      errorsFor({ ...details, receptionMode: "drone" }).receptionMode,
    ).toBeDefined();
  });
});

describe("quoteSubmissionSchema", () => {
  it("refuse un devis vide, des quantités invalides et l'absence d'accord", () => {
    const result = quoteSubmissionSchema.safeParse({
      details,
      lines: [],
      consent: undefined,
    });
    expect(result.success).toBe(false);
    const bad = quoteSubmissionSchema.safeParse({
      details,
      lines: [{ productId: "p1", quantity: 0 }],
      consent: "on",
    });
    expect(bad.success).toBe(false);
  });

  it("accepte une demande complète", () => {
    const result = quoteSubmissionSchema.parse({
      details,
      lines: [{ productId: "p1", quantity: 3 }],
      consent: "on",
    });
    expect(result.details.phone).toBe("0612345678");
    expect(result.lines).toEqual([{ productId: "p1", quantity: 3 }]);
  });
});

describe("quoteDetailsSchema — erreurs simultanées", () => {
  it("signale l'adresse manquante même si le SIRET est aussi invalide", () => {
    const errors = errorsFor({
      ...details,
      siret: "123",
      addressLine: "",
      city: "",
    });
    expect(errors.siret).toBe("Le SIRET compte 14 chiffres.");
    expect(errors.addressLine).toBe("Indiquez l'adresse de livraison.");
    expect(errors.city).toBe("Indiquez la ville.");
  });
});
