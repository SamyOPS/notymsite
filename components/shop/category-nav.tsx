import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  buildCatalogHref,
  type CatalogFilters,
  type FacetOption,
} from "@/lib/catalog/search";

type CategoryNavProps = {
  filters: CatalogFilters;
  categories: FacetOption[];
  /** Nombre de produits toutes catégories confondues (avec les autres filtres). */
  totalAll: number;
  /** Id du titre, unique dans la page (le panneau existe aussi dans le tiroir mobile). */
  headingId: string;
};

/**
 * Univers et catégories sous forme de liens (/catalogue/[categorie]) :
 * URL propres et indexables. Les catégories sont listées sous leur univers.
 */
export function CategoryNav({
  filters,
  categories,
  totalAll,
  headingId,
}: CategoryNavProps) {
  const universes = categories.filter((c) => !c.parent);
  const childrenOf = (slug: string) =>
    categories.filter((c) => c.parent === slug);

  const item = (
    option: { value: string | null; label: string; count: number },
    nested = false,
  ) => {
    const active = option.value === filters.category;
    return (
      <Link
        href={buildCatalogHref({ ...filters, category: option.value, page: 1 })}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-11 items-center justify-between gap-3 text-ink underline-offset-4 transition-colors hover:underline",
          nested ? "pl-4 text-body" : "text-body font-semibold",
          active && "underline decoration-accent-fill decoration-2",
        )}
      >
        <span>{option.label}</span>
        <span className="text-caption font-normal text-ink-muted tabular-nums">
          <span aria-hidden>{option.count}</span>
          <span className="sr-only">
            , {option.count} produit{option.count > 1 ? "s" : ""}
          </span>
        </span>
      </Link>
    );
  };

  return (
    <nav aria-labelledby={headingId} className="border-b border-line pb-4">
      <h2
        id={headingId}
        className="flex min-h-11 items-center font-sans text-label text-ink"
      >
        Catégorie
      </h2>
      <ul className="flex flex-col">
        <li>
          {item({ value: null, label: "Tout le catalogue", count: totalAll })}
        </li>
        {universes.map((universe) => {
          const children = childrenOf(universe.value);
          return (
            <li key={universe.value}>
              {item(universe)}
              {children.length > 0 && (
                <ul>
                  {children.map((child) => (
                    <li key={child.value}>{item(child, true)}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
