import { describe, expect, it } from "vitest";
import type { Brand, Category, Product } from "@/types/catalog";
import {
  buildCatalogHref,
  normalizeText,
  parseCatalogParams,
  searchProducts,
  type CatalogFilters,
} from "./search";

const categories: Category[] = [
  {
    id: "c1",
    slug: "sodas",
    name: "Sodas",
    description: "",
    tone: "teal",
    sort: 1,
  },
  {
    id: "c2",
    slug: "jus",
    name: "Jus",
    description: "",
    tone: "wheat",
    sort: 2,
  },
];
const brands: Brand[] = [
  { id: "b1", slug: "alpha", name: "Alpha", logoUrl: null },
  { id: "b2", slug: "beta", name: "Bêta", logoUrl: null },
  { id: "b3", slug: "gamma", name: "Gamma", logoUrl: null },
];

function product(id: string, overrides: Partial<Product>): Product {
  return {
    id,
    slug: id,
    sku: null,
    name: id,
    brandSlug: "alpha",
    categorySlug: "sodas",
    volume: "33 cl",
    unitsPerPack: 24,
    packLabel: "Pack de 24",
    description: null,
    images: [],
    isBestSeller: false,
    isNew: false,
    isPromo: false,
    inStock: true,
    featured: false,
    popularity: 0,
    priceFromHtCents: null,
    legacyId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

const products: Product[] = [
  product("p1", {
    name: "Zeste",
    brandSlug: "alpha",
    popularity: 5,
    priceFromHtCents: 900,
  }),
  product("p2", {
    name: "Hawaï tropical",
    brandSlug: "beta",
    unitsPerPack: 12,
    popularity: 9,
  }),
  product("p3", {
    name: "Agrume",
    brandSlug: "beta",
    categorySlug: "jus",
    inStock: false,
    priceFromHtCents: 500,
    createdAt: "2026-06-01T00:00:00.000Z",
  }),
  product("p4", {
    name: "Mystère",
    brandSlug: "alpha",
    unitsPerPack: null,
    packLabel: "À confirmer",
  }),
];

const context = { brands, categories };
const base = parseCatalogParams({});
const run = (f: Partial<CatalogFilters>, pageSize?: number) =>
  searchProducts(products, { ...base, ...f }, context, pageSize);

describe("parseCatalogParams", () => {
  it("ignore les valeurs invalides ou dangereuses", () => {
    const f = parseCatalogParams({
      q: "  coca  ",
      marque: ["coca-cola", "<script>", "coca-cola"],
      conditionnement: ["24", "abc", "-3", "6"],
      tri: "inconnu",
      page: "0",
      dispo: "en-stock",
    });
    expect(f).toEqual({
      q: "coca",
      category: null,
      brands: ["coca-cola"],
      packs: [6, 24],
      inStockOnly: true,
      sort: "populaires",
      page: 1,
    });
  });
});

describe("buildCatalogHref", () => {
  it("produit une URL stable, sans les valeurs par défaut", () => {
    expect(buildCatalogHref(base)).toBe("/catalogue");
    expect(
      buildCatalogHref({
        ...base,
        category: "sodas",
        brands: ["alpha", "beta"],
        packs: [24],
        inStockOnly: true,
        sort: "nom",
        page: 2,
      }),
    ).toBe(
      "/catalogue/sodas?marque=alpha&marque=beta&conditionnement=24&dispo=en-stock&tri=nom&page=2",
    );
  });

  it("relit ce qu'elle écrit", () => {
    const f: CatalogFilters = {
      ...base,
      q: "thé glacé",
      brands: ["beta"],
      packs: [12],
      sort: "prix",
    };
    const href = buildCatalogHref(f);
    const params = Object.fromEntries(
      [...new URL(href, "https://x").searchParams.keys()].map((k) => [
        k,
        new URL(href, "https://x").searchParams.getAll(k),
      ]),
    );
    expect(parseCatalogParams(params)).toEqual(f);
  });
});

describe("searchProducts", () => {
  it("trie par popularité par défaut", () => {
    expect(run({}).items.map((p) => p.id)).toEqual(["p2", "p1", "p3", "p4"]);
  });

  it("trie par prix croissant, les produits sans prix en dernier", () => {
    expect(run({ sort: "prix" }).items.map((p) => p.id)).toEqual([
      "p3",
      "p1",
      "p2",
      "p4",
    ]);
  });

  it("trie par nom et par nouveauté", () => {
    expect(run({ sort: "nom" }).items.map((p) => p.name)).toEqual([
      "Agrume",
      "Hawaï tropical",
      "Mystère",
      "Zeste",
    ]);
    expect(run({ sort: "nouveautes" }).items[0]?.id).toBe("p3");
  });

  it("recherche sans tenir compte des accents ni de la casse", () => {
    expect(run({ q: "HAWAI" }).items.map((p) => p.id)).toEqual(["p2"]);
    expect(run({ q: "beta jus" }).items.map((p) => p.id)).toEqual(["p3"]);
    expect(normalizeText("Énergisants")).toBe("energisants");
  });

  it("combine catégorie, marques, conditionnement et disponibilité", () => {
    expect(
      run({ category: "sodas", brands: ["beta"] }).items.map((p) => p.id),
    ).toEqual(["p2"]);
    expect(run({ packs: [24] }).items.map((p) => p.id)).toEqual(["p1", "p3"]);
    expect(run({ inStockOnly: true }).total).toBe(3);
  });

  it("compte chaque option en appliquant les autres filtres", () => {
    const { facets } = run({ category: "sodas", brands: ["alpha"] });
    expect(facets.brands).toEqual([
      { value: "alpha", label: "Alpha", count: 2 },
      { value: "beta", label: "Bêta", count: 1 },
    ]);
    expect(facets.categories).toEqual([
      { value: "sodas", label: "Sodas", count: 2 },
      { value: "jus", label: "Jus", count: 0 },
    ]);
    expect(facets.packs).toEqual([
      { value: "24", label: "Pack de 24", count: 1 },
    ]);
    expect(facets.inStock).toBe(2);
  });

  it("pagine et ramène une page trop grande à la dernière page", () => {
    const first = run({}, 3);
    expect(first.totalPages).toBe(2);
    expect(first.items).toHaveLength(3);
    const beyond = run({ page: 9 }, 3);
    expect(beyond.page).toBe(2);
    expect(beyond.items.map((p) => p.id)).toEqual(["p4"]);
  });
});

describe("stock non renseigné", () => {
  it("n'est jamais compté ni filtré comme « en stock »", () => {
    const unknown = [
      product("u1", { inStock: null }),
      product("u2", { inStock: true }),
    ];
    const filtered = searchProducts(
      unknown,
      { ...base, inStockOnly: true },
      context,
    );
    expect(filtered.items.map((p) => p.id)).toEqual(["u2"]);
    expect(searchProducts(unknown, base, context).facets.inStock).toBe(1);
  });
});
