import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminPageHeader,
  SavedNotice,
  savedMessage,
} from "@/components/admin/page-header";
import {
  AdminTable,
  Td,
  Th,
  rowClass,
  stretchedLink,
} from "@/components/admin/table";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { listAdminCategories } from "@/lib/admin/data";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Catégories" };

export default async function CategoriesPage({
  searchParams,
}: PageProps<"/admin/categories">) {
  const [categories, { ok }] = await Promise.all([
    listAdminCategories(),
    searchParams,
  ]);
  const universes = categories.filter((c) => c.parent_id === null);
  const rows = universes.flatMap((universe) => [
    { ...universe, level: 0 },
    ...categories
      .filter((c) => c.parent_id === universe.id)
      .map((c) => ({ ...c, level: 1 })),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Catégories"
        description="Deux niveaux : les univers (Boissons, Épicerie sucrée…) et leurs catégories. La page d'un univers regroupe les produits de toutes ses catégories."
        actions={
          <ButtonLink href="/admin/categories/nouveau">
            Ajouter une catégorie
          </ButtonLink>
        }
      />
      <SavedNotice message={savedMessage(ok)} />

      <AdminTable
        caption="Univers et catégories"
        head={
          <>
            <Th>Nom</Th>
            <Th>Adresse</Th>
            <Th className="text-right">Produits</Th>
            <Th className="text-right">Ordre</Th>
          </>
        }
      >
        {rows.map((category) => (
          <tr key={category.id} className={rowClass}>
            <Td className={cn(category.level === 1 && "pl-10")}>
              <Link
                href={`/admin/categories/${category.id}`}
                className={cn(
                  stretchedLink,
                  category.level === 1 && "font-normal",
                )}
              >
                {category.name}
              </Link>
              {category.level === 0 && (
                <span className="ml-2 text-caption text-ink-muted">
                  univers
                </span>
              )}
            </Td>
            <Td className="font-mono text-caption">
              /catalogue/{category.slug}
            </Td>
            <Td className="text-right tabular-nums">{category.productCount}</Td>
            <Td className="text-right tabular-nums">{category.sort}</Td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
