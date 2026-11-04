import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { submitContactRequest } = await import("./actions");

const idle = { status: "idle" } as const;

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const valid = {
  kind: "devis",
  establishmentType: "restaurant",
  companyName: "Restaurant de démonstration",
  siret: "98048419000023",
  contactName: "Prénom Nom",
  phone: "0612345678",
  email: "contact@exemple.fr",
  addressLine: "1 rue de l'Exemple",
  postalCode: "75001",
  city: "Paris",
  message: "Besoin régulier",
  consent: "on",
};

describe("submitContactRequest", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("renvoie les erreurs et conserve les valeurs saisies", async () => {
    const state = await submitContactRequest(
      idle,
      form({ ...valid, siret: "123", consent: "" }),
    );
    expect(state.status).toBe("invalid");
    if (state.status !== "invalid") return;
    expect(state.errors.siret).toBe("Le SIRET compte 14 chiffres.");
    expect(state.errors.consent).toBeDefined();
    expect(state.values.companyName).toBe(valid.companyName);
    expect(state.values.siret).toBe("123");
  });

  it("accepte une demande valide en développement", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    const state = await submitContactRequest(idle, form(valid));
    expect(state).toEqual({ status: "success" });
  });

  it("ne prétend jamais avoir envoyé la demande en production sans canal branché", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const state = await submitContactRequest(idle, form(valid));
    expect(state.status).toBe("unavailable");
  });

  it("ignore silencieusement les robots (pot de miel rempli)", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const state = await submitContactRequest(
      idle,
      form({ ...valid, website: "http://spam" }),
    );
    expect(state).toEqual({ status: "success" });
    expect(info).not.toHaveBeenCalled();
  });
});
