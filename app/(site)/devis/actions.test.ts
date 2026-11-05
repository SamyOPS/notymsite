import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ cacheTag: () => {}, cacheLife: () => {} }));

const { submitQuoteRequest, loadQuoteProducts } = await import("./actions");

const details = {
  receptionMode: "retrait",
  establishmentType: "epicerie",
  companyName: "Épicerie de démonstration",
  siret: "98048419000023",
  contactName: "Prénom Nom",
  phone: "0612345678",
  email: "contact@exemple.fr",
};
const lines = [
  { productId: "prod-6", quantity: 3 },
  { productId: "prod-1", quantity: 1 },
];

describe("submitQuoteRequest", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("renvoie à l'étape 1 si la sélection est vide", async () => {
    const result = await submitQuoteRequest({
      details,
      lines: [],
      consent: "on",
    });
    expect(result).toMatchObject({ status: "invalid", step: 1 });
  });

  it("renvoie à l'étape 2 avec les erreurs de coordonnées", async () => {
    const result = await submitQuoteRequest({
      details: { ...details, siret: "123", receptionMode: "livraison" },
      lines,
      consent: "on",
    });
    expect(result.status).toBe("invalid");
    if (result.status !== "invalid") return;
    expect(result.step).toBe(2);
    expect(result.errors.siret).toBe("Le SIRET compte 14 chiffres.");
    expect(result.errors.addressLine).toBe("Indiquez l'adresse de livraison.");
  });

  it("reste à l'étape 3 si seul le consentement manque", async () => {
    const result = await submitQuoteRequest({ details, lines });
    expect(result).toMatchObject({ status: "invalid", step: 3 });
  });

  it("refuse un produit qui n'existe plus", async () => {
    const result = await submitQuoteRequest({
      details,
      lines: [{ productId: "produit-supprime", quantity: 1 }],
      consent: "on",
    });
    expect(result).toMatchObject({ status: "invalid", step: 1 });
  });

  it("transmet la demande avec les produits et renvoie une référence", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const result = await submitQuoteRequest({ details, lines, consent: "on" });
    expect(result.status).toBe("success");
    if (result.status === "success")
      expect(result.reference).toMatch(/^D-\d{8}-\w{4}$/);
    const sent = info.mock.calls[0]?.[1] as {
      lines: Array<{ name: string; quantity: number }>;
    };
    expect(sent.lines).toEqual([
      expect.objectContaining({ name: "Red Bull 25 cl", quantity: 3 }),
      expect.objectContaining({ name: "Coca-Cola 1,5 L", quantity: 1 }),
    ]);
  });

  it("ne prétend jamais avoir envoyé en production sans canal branché", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const result = await submitQuoteRequest({ details, lines, consent: "on" });
    expect(result.status).toBe("unavailable");
  });

  it("ignore silencieusement les robots", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const result = await submitQuoteRequest({
      details,
      lines,
      consent: "on",
      website: "spam",
    });
    expect(result).toEqual({ status: "success" });
    expect(info).not.toHaveBeenCalled();
  });
});

describe("loadQuoteProducts", () => {
  it("renvoie les produits connus et ignore les identifiants invalides", async () => {
    const products = await loadQuoteProducts(["prod-6", "inconnu", "prod-6"]);
    expect(products.map((p) => p.name)).toEqual(["Red Bull 25 cl"]);
    expect(
      await loadQuoteProducts("pas un tableau" as unknown as string[]),
    ).toEqual([]);
  });
});
