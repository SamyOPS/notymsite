"use client";

import { useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import {
  buildCatalogHref,
  DEFAULT_SORT,
  type CatalogFilters,
  type FacetOption,
} from "@/lib/catalog/search";
import { useCatalogNavigation } from "./catalog-navigation";
import { FilterGroup } from "./filter-group";

type FiltersFormProps = {
  filters: CatalogFilters;
  facets: { brands: FacetOption[]; packs: FacetOption[]; inStock: number };
};

/**
 * Filtres marque / conditionnement / disponibilité. Avec JavaScript, chaque
 * case met à jour l'URL immédiatement ; sans, le bouton « Appliquer » envoie
 * le formulaire en GET.
 */
export function FiltersForm({ filters, facets }: FiltersFormProps) {
  const { navigate } = useCatalogNavigation();
  const [optimistic, setOptimistic] = useOptimistic(filters);

  const apply = (next: CatalogFilters) => {
    const target = { ...next, page: 1 };
    navigate(buildCatalogHref(target), () => setOptimistic(target));
  };

  const toggle = <T,>(list: T[], value: T, checked: boolean) =>
    checked ? [...list, value] : list.filter((v) => v !== value);

  const action = filters.category
    ? `/catalogue/${filters.category}`
    : "/catalogue";

  return (
    <form action={action} method="get" aria-label="Filtres du catalogue">
      {filters.q && <input type="hidden" name="q" value={filters.q} />}
      {filters.sort !== DEFAULT_SORT && (
        <input type="hidden" name="tri" value={filters.sort} />
      )}

      <FilterGroup
        legend="Marque"
        name="marque"
        options={facets.brands}
        selected={optimistic.brands}
        resetHref={buildCatalogHref({ ...filters, brands: [], page: 1 })}
        onToggle={(value, checked) =>
          apply({
            ...optimistic,
            brands: toggle(optimistic.brands, value, checked),
          })
        }
      />

      {facets.packs.length > 0 && (
        <FilterGroup
          legend="Conditionnement"
          name="conditionnement"
          options={facets.packs}
          selected={optimistic.packs.map(String)}
          resetHref={buildCatalogHref({ ...filters, packs: [], page: 1 })}
          onToggle={(value, checked) =>
            apply({
              ...optimistic,
              packs: toggle(optimistic.packs, Number(value), checked).sort(
                (a, b) => a - b,
              ),
            })
          }
        />
      )}

      <FilterGroup
        legend="Disponibilité"
        name="dispo"
        options={[
          { value: "en-stock", label: "En stock", count: facets.inStock },
        ]}
        selected={optimistic.inStockOnly ? ["en-stock"] : []}
        onToggle={(_value, checked) =>
          apply({ ...optimistic, inStockOnly: checked })
        }
      />

      <noscript>
        <Button type="submit" variant="dark" className="mt-4 w-full">
          Appliquer les filtres
        </Button>
      </noscript>
    </form>
  );
}
