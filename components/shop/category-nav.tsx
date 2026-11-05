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

/** Catégories sous forme de liens (/catalogue/[categorie]) : URL propres et indexables. */
export function CategoryNav({
  filters,
  categories,
  totalAll,
  headingId,
}: CategoryNavProps) {
  const items = [
    { value: null, label: "Toutes les catégories", count: totalAll },
    ...categories.map((c) => ({ ...c, value: c.value as string | null })),
  ];

  return (
    <nav aria-labelledby={headingId} className="border-b border-line pb-4">
      <h2
        id={headingId}
        className="flex min-h-11 items-center font-sans text-label text-ink"
      >
        Catégorie
      </h2>
      <ul className="flex flex-col">
        {items.map((item) => {
          const active = item.value === filters.category;
          return (
            <li key={item.value ?? "toutes"}>
              <Link
                href={buildCatalogHref({
                  ...filters,
                  category: item.value,
                  page: 1,
                })}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center justify-between gap-3 text-body text-ink underline-offset-4 transition-colors hover:underline",
                  active &&
                    "font-semibold underline decoration-accent-fill decoration-2",
                )}
              >
                <span>{item.label}</span>
                <span className="text-caption text-ink-muted tabular-nums">
                  <span aria-hidden>{item.count}</span>
                  <span className="sr-only">
                    , {item.count} produit{item.count > 1 ? "s" : ""}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
