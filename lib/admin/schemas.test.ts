import { beforeAll, describe, expect, it } from "vitest";
import {
  articleSchema,
  categorySchema,
  parseEuros,
  productSchema,
} from "./schemas";

const MEDIA = "https://projet.supabase.co/storage/v1/object/public/media/";

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://projet.supabase.co";
});

const product = (overrides: Record<string, unknown> = {}) => ({
  name: "Coca-Cola 33 cl",
  slug: "",
  brandId: "",
  categoryId: "3f1c2d9e-8a7b-4c6d-9e0f-1a2b3c4d5e6f",
  volume: "33 cl",
  unitsPerPack: "24",
  packLabel: "",
  sku: "",
  description: "",
  images: [],
  stock: "",
  price: "",
  popularity: "",
  published: "on",
  ...overrides,
});

describe("parseEuros", () => {
  it("convertit les euros en centimes", () => {
    expect(parseEuros("12,90")).toBe(1290);
    expect(parseEuros("12.9")).toBe(1290);
    expect(parseEuros(" 8 € ")).toBe(800);
    expect(parseEuros("")).toBeNull();
    expect(parseEuros("12,999")).toBeUndefined();
    expect(parseEuros("abc")).toBeUndefined();
  });
});

describe("productSchema", () => {
  it("complète l'adresse et le conditionnement", () => {
    const row = productSchema.parse(product());
    expect(row).toMatchObject({
      slug: "coca-cola-33-cl",
      pack_label: "Pack de 24",
      units_per_pack: 24,
      brand_id: null,
      in_stock: null,
      price_from_ht_cents: null,
      popularity: 0,
      published: true,
      featured: false,
    });
  });

  it("exige un conditionnement ou un nombre d'unités", () => {
    const result = productSchema.safeParse(product({ unitsPerPack: "" }));
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["packLabel"]);
  });

  it("refuse une adresse mal formée et une catégorie absente", () => {
    const result = productSchema.safeParse(
      product({ slug: "Coca Cola", categoryId: "" }),
    );
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["slug", "categoryId"]));
  });

  it("n'accepte que les photos du site ou du bucket media", () => {
    expect(
      productSchema.safeParse(
        product({
          images: ["/products/perrier.webp", `${MEDIA}products/abc-123.webp`],
        }),
      ).success,
    ).toBe(true);
    expect(
      productSchema.safeParse(
        product({ images: ["https://ailleurs.example/photo.webp"] }),
      ).success,
    ).toBe(false);
    expect(
      productSchema.safeParse(product({ images: [`${MEDIA}../secret.webp`] }))
        .success,
    ).toBe(false);
  });

  it("lit le stock et le prix", () => {
    const row = productSchema.parse(
      product({ stock: "rupture", price: "15,50", packLabel: "Carton" }),
    );
    expect(row.in_stock).toBe(false);
    expect(row.price_from_ht_cents).toBe(1550);
    expect(row.pack_label).toBe("Carton");
  });
});

describe("categorySchema", () => {
  it("crée un univers sans parent", () => {
    expect(
      categorySchema.parse({
        name: "Épicerie sucrée",
        slug: "",
        description: "",
        parentId: "",
        sort: "",
      }),
    ).toEqual({
      name: "Épicerie sucrée",
      slug: "epicerie-sucree",
      description: "",
      parent_id: null,
      sort: 0,
    });
  });
});

describe("articleSchema", () => {
  const article = (overrides: Record<string, unknown> = {}) => ({
    title: "Arrivage de novembre",
    slug: "",
    excerpt: "",
    content: "Nouveaux produits.",
    coverUrl: [],
    coverAlt: "",
    publishedOn: "",
    ...overrides,
  });

  it("demande une description de la photo", () => {
    const result = articleSchema.safeParse(
      article({ coverUrl: [`${MEDIA}articles/photo-1.webp`] }),
    );
    expect(result.error?.issues[0]?.path).toEqual(["coverAlt"]);
  });

  it("refuse de publier un article vide", () => {
    const result = articleSchema.safeParse(
      article({ content: "", published: "on" }),
    );
    expect(result.error?.issues[0]?.path).toEqual(["content"]);
  });

  it("fixe la date choisie à midi UTC", () => {
    expect(
      articleSchema.parse(article({ publishedOn: "2026-11-19" })).publishedOn,
    ).toBe("2026-11-19T12:00:00Z");
  });
});
