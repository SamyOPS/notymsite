import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button";
import type { Crumb } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getBrands, searchCatalog } from "@/lib/catalog/queries";
import {
  buildCatalogHref,
  DEFAULT_SORT,
  parseCatalogParams,
} from "@/lib/catalog/search";
import type { SearchParamsRecord } from "@/lib/pagination";
import { site } from "@/lib/site";
import type { Category } from "@/types/catalog";
import { ActiveFilters } from "./active-filters";
import { CatalogNavigationProvider, ResultsRegion } from "./catalog-navigation";
import { CategoryNav } from "./category-nav";
import { FiltersForm } from "./filters-form";
import { MobileFilters } from "./mobile-filters";
import { ProductCard } from "./product-card";
import { ProductGrid } from "./product-grid";
import { SearchForm } from "./search-form";
import { SortSelect } from "./sort-select";

type CatalogViewProps = {
  category: Category | null;
  searchParams: Promise<SearchParamsRecord>;
};

/**
 * Page catalogue : l'en-tête est statique, les résultats (qui dépendent de
 * l'URL) sont rendus côté serveur à chaque requête, derrière <Suspense>.
 */
export function CatalogView({ category, searchParams }: CatalogViewProps) {
  const breadcrumb: Crumb[] = category
    ? [
        { label: "Accueil", href: "/" },
        { label: "Catalogue", href: "/catalogue" },
        { label: category.name },
      ]
    : [{ label: "Accueil", href: "/" }, { label: "Catalogue" }];

  return (
    <>
      <PageHero
        breadcrumb={breadcrumb}
        title={category ? category.name : "Catalogue"}
        intro={
          <p>
            {category
              ? `${category.description}.`
              : "Sodas, eaux, énergisants, jus et snacks pour les professionnels."}
          </p>
        }
      />
      <div className="container-site border-t border-ink pt-8">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogResults category={category} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function CatalogResults({ category, searchParams }: CatalogViewProps) {
  const params = await searchParams;
  const parsed = parseCatalogParams(params, category?.slug ?? null);
  // Prix masqués : le tri par prix n'est pas proposé (ancien lien → tri par défaut).
  const filters =
    !site.features.showPrices && parsed.sort === "prix"
      ? { ...parsed, sort: DEFAULT_SORT }
      : parsed;
  const [result, brands, allCategories] = await Promise.all([
    searchCatalog(filters),
    getBrands(),
    searchCatalog({ ...filters, category: null, page: 1 }),
  ]);

  const activeCount =
    filters.brands.length +
    filters.packs.length +
    (filters.inStockOnly ? 1 : 0);
  const sidebar = (idPrefix: string) => (
    <>
      <SearchForm
        id={`${idPrefix}-recherche`}
        defaultValue={filters.q}
        className="mb-6"
      />
      <CategoryNav
        filters={filters}
        categories={result.facets.categories}
        totalAll={allCategories.total}
        headingId={`${idPrefix}-categorie`}
      />
      <FiltersForm filters={filters} facets={result.facets} />
    </>
  );
  const pathname = category ? `/catalogue/${category.slug}` : "/catalogue";

  return (
    <CatalogNavigationProvider>
      <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside aria-label="Filtres" className="hidden lg:block">
          {sidebar("filtres")}
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p role="status" className="text-body-lg font-semibold">
              {result.total} produit{result.total > 1 ? "s" : ""}
              {filters.q && (
                <span className="font-normal text-ink-muted">
                  {" "}
                  pour « {filters.q} »
                </span>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <MobileFilters activeCount={activeCount} total={result.total}>
                {sidebar("tiroir")}
              </MobileFilters>
              <SortSelect filters={filters} />
            </div>
          </div>

          <ActiveFilters filters={filters} brands={brands} />

          <ResultsRegion>
            {result.items.length > 0 ? (
              <ProductGrid columns="xl:grid-cols-3">
                {result.items.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} headingLevel="h2" />
                  </li>
                ))}
              </ProductGrid>
            ) : (
              <EmptyState
                title="Aucun produit ne correspond"
                description={
                  <p>
                    Modifiez ou retirez des filtres pour élargir la recherche.
                  </p>
                }
                actions={
                  <ButtonLink
                    href={buildCatalogHref({
                      ...filters,
                      q: "",
                      brands: [],
                      packs: [],
                      inStockOnly: false,
                      page: 1,
                    })}
                  >
                    Effacer les filtres
                  </ButtonLink>
                }
              />
            )}
          </ResultsRegion>

          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            pathname={pathname}
            searchParams={params}
            className="mt-4"
          />
        </div>
      </div>
    </CatalogNavigationProvider>
  );
}

function CatalogSkeleton() {
  return (
    <div aria-busy className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <span className="sr-only">Chargement du catalogue…</span>
      <div aria-hidden className="hidden flex-col gap-3 lg:flex">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-10 bg-line/50 motion-safe:animate-pulse" />
        ))}
      </div>
      <div aria-hidden>
        <ProductGrid columns="xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="flex flex-col bg-surface-raised">
              <div className="aspect-square bg-teal-soft motion-safe:animate-pulse" />
              <div className="flex flex-col gap-2 p-4">
                <div className="h-5 w-2/3 bg-line/60" />
                <div className="h-4 w-1/3 bg-line/40" />
              </div>
            </li>
          ))}
        </ProductGrid>
      </div>
    </div>
  );
}
