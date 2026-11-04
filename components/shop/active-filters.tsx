import { X } from "lucide-react";
import Link from "next/link";
import { buildCatalogHref, type CatalogFilters } from "@/lib/catalog/search";
import type { Brand } from "@/types/catalog";

type Chip = { key: string; label: string; href: string };

/** Puces des filtres actifs : chaque puce est un lien qui retire le filtre. */
export function ActiveFilters({
  filters,
  brands,
}: {
  filters: CatalogFilters;
  brands: Brand[];
}) {
  const reset = { ...filters, page: 1 };
  const chips: Chip[] = [
    ...(filters.q
      ? [
          {
            key: "q",
            label: `Recherche : « ${filters.q} »`,
            href: buildCatalogHref({ ...reset, q: "" }),
          },
        ]
      : []),
    ...filters.brands.map((slug) => ({
      key: `marque-${slug}`,
      label: `Marque : ${brands.find((b) => b.slug === slug)?.name ?? slug}`,
      href: buildCatalogHref({
        ...reset,
        brands: filters.brands.filter((b) => b !== slug),
      }),
    })),
    ...filters.packs.map((pack) => ({
      key: `pack-${pack}`,
      label: `Pack de ${pack}`,
      href: buildCatalogHref({
        ...reset,
        packs: filters.packs.filter((p) => p !== pack),
      }),
    })),
    ...(filters.inStockOnly
      ? [
          {
            key: "dispo",
            label: "En stock",
            href: buildCatalogHref({ ...reset, inStockOnly: false }),
          },
        ]
      : []),
  ];

  if (chips.length === 0) return null;

  const clearAll = buildCatalogHref({
    ...reset,
    q: "",
    brands: [],
    packs: [],
    inStockOnly: false,
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="sr-only">Filtres actifs</h2>
      <ul className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={chip.key}>
            <Link
              href={chip.href}
              scroll={false}
              aria-label={`Retirer le filtre ${chip.label}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-line-strong bg-surface-raised pr-3 pl-4 text-label text-ink transition-colors hover:border-ink"
            >
              {chip.label}
              <X aria-hidden className="size-4" />
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={clearAll}
        scroll={false}
        className="inline-flex min-h-11 items-center px-2 text-label text-accent-text underline underline-offset-4"
      >
        Tout effacer
      </Link>
    </div>
  );
}
