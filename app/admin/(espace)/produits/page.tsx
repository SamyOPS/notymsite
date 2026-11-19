import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AdminPageHeader,
  SavedNotice,
  savedMessage,
} from "@/components/admin/page-header";
import { Tag } from "@/components/admin/status-badge";
import {
  AdminTable,
  Td,
  Th,
  rowClass,
  stretchedLink,
} from "@/components/admin/table";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import {
  isUuid,
  listAdminProducts,
  listCategoryOptions,
  type ProductFilters,
} from "@/lib/admin/data";
import { packagingLabel } from "@/lib/format";
import { CategoryOptions } from "./category-options";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Produits" };

const visibilities = [
  { value: "toutes", label: "Tous" },
  { value: "visibles", label: "Visibles sur le site" },
  { value: "masques", label: "Masqués" },
] as const;

export default async function ProductsPage({
  searchParams,
}: PageProps<"/admin/produits">) {
  const params = await searchParams;
  const filters: ProductFilters = {
    q: typeof params.q === "string" ? params.q : "",
    categoryId: isUuid(params.categorie) ? params.categorie : null,
    visibility:
      visibilities.find((v) => v.value === params.visibilite)?.value ??
      "toutes",
    page: Math.max(1, Number(params.page) || 1),
  };
  const [{ items, total, totalPages }, categories] = await Promise.all([
    listAdminProducts(filters),
    listCategoryOptions(),
  ]);
  const filtered =
    filters.q !== "" ||
    filters.categoryId !== null ||
    filters.visibility !== "toutes";

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Produits"
        actions={
          <ButtonLink href="/admin/produits/nouveau">
            Ajouter un produit
          </ButtonLink>
        }
      />
      <SavedNotice message={savedMessage(params.ok)} />

      <form
        role="search"
        className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_16rem_14rem_auto]"
      >
        <Input
          label="Rechercher"
          name="q"
          type="search"
          placeholder="Nom ou référence"
          defaultValue={filters.q}
        />
        <Select
          label="Catégorie"
          name="categorie"
          defaultValue={filters.categoryId ?? ""}
        >
          <option value="">Toutes</option>
          <CategoryOptions categories={categories} mode="filter" />
        </Select>
        <Select
          label="Visibilité"
          name="visibilite"
          defaultValue={filters.visibility}
        >
          {visibilities.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </Select>
        <div className="flex gap-3">
          <Button type="submit" variant="dark">
            Filtrer
          </Button>
          {filtered && (
            <ButtonLink href="/admin/produits" variant="secondary">
              Effacer
            </ButtonLink>
          )}
        </div>
      </form>

      <p className="text-body text-ink-muted">
        {total} produit{total > 1 ? "s" : ""}
        {filtered ? " correspondant aux filtres" : ""}
      </p>

      {items.length > 0 && (
        <AdminTable
          caption="Produits"
          head={
            <>
              <Th className="w-20">
                <span className="sr-only">Photo</span>
              </Th>
              <Th>Produit</Th>
              <Th>Catégorie</Th>
              <Th>Statut</Th>
            </>
          }
        >
          {items.map((product) => (
            <tr key={product.id} className={rowClass}>
              <Td>
                <div className="relative size-14 overflow-hidden bg-white ring-1 ring-line">
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt=""
                      fill
                      unoptimized
                      sizes="56px"
                      className="object-contain"
                    />
                  )}
                </div>
              </Td>
              <Td>
                <Link
                  href={`/admin/produits/${product.id}`}
                  className={stretchedLink}
                >
                  {product.name}
                </Link>
                <span className="block text-caption text-ink-muted">
                  {[
                    product.brand?.name,
                    packagingLabel(product.pack_label, product.volume),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </Td>
              <Td className="text-caption">{product.category?.name}</Td>
              <Td>
                <span className="flex flex-wrap gap-1.5">
                  {product.published ? (
                    <Tag tone="positive">Visible</Tag>
                  ) : (
                    <Tag tone="muted">Masqué</Tag>
                  )}
                  {product.featured && <Tag>Accueil</Tag>}
                  {product.in_stock === false && (
                    <Tag tone="muted">Rupture</Tag>
                  )}
                </span>
              </Td>
            </tr>
          ))}
        </AdminTable>
      )}

      <Pagination
        page={Math.min(filters.page, totalPages)}
        totalPages={totalPages}
        pathname="/admin/produits"
        searchParams={{
          q: filters.q || undefined,
          categorie: filters.categoryId ?? undefined,
          visibilite:
            filters.visibility === "toutes" ? undefined : filters.visibility,
        }}
      />
    </div>
  );
}
