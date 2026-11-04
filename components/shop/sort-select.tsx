"use client";

import { ChevronDown } from "lucide-react";
import { useId, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import {
  buildCatalogHref,
  sortOptions,
  type CatalogFilters,
  type SortKey,
} from "@/lib/catalog/search";
import { useCatalogNavigation } from "./catalog-navigation";

/** Tri du catalogue. Conserve les filtres actifs, revient en page 1. */
export function SortSelect({ filters }: { filters: CatalogFilters }) {
  const id = useId();
  const { navigate } = useCatalogNavigation();
  const [sort, setSort] = useOptimistic(filters.sort);
  const action = filters.category
    ? `/catalogue/${filters.category}`
    : "/catalogue";

  return (
    <form action={action} method="get" className="flex items-center gap-3">
      {filters.q && <input type="hidden" name="q" value={filters.q} />}
      {filters.brands.map((b) => (
        <input key={b} type="hidden" name="marque" value={b} />
      ))}
      {filters.packs.map((p) => (
        <input key={p} type="hidden" name="conditionnement" value={p} />
      ))}
      {filters.inStockOnly && (
        <input type="hidden" name="dispo" value="en-stock" />
      )}

      <label htmlFor={id} className="text-label whitespace-nowrap text-ink">
        Trier par
      </label>
      <div className="relative">
        <select
          id={id}
          name="tri"
          value={sort}
          onChange={(event) => {
            const next = event.target.value as SortKey;
            navigate(
              buildCatalogHref({ ...filters, sort: next, page: 1 }),
              () => setSort(next),
            );
          }}
          className="h-11 cursor-pointer appearance-none rounded-sm border border-line-strong bg-surface-raised pr-10 pl-4 text-body text-ink hover:border-ink-muted focus-visible:border-teal-deep"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted"
        />
      </div>
      <noscript>
        <Button type="submit" variant="secondary">
          Trier
        </Button>
      </noscript>
    </form>
  );
}
