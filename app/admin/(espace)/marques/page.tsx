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
import { listAdminBrands } from "@/lib/admin/data";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Marques" };

export default async function BrandsPage({
  searchParams,
}: PageProps<"/admin/marques">) {
  const [brands, { ok }] = await Promise.all([listAdminBrands(), searchParams]);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Marques"
        description="Les marques servent au filtre « Marque » du catalogue et s'affichent sur les fiches produit."
        actions={
          <ButtonLink href="/admin/marques/nouveau">
            Ajouter une marque
          </ButtonLink>
        }
      />
      <SavedNotice message={savedMessage(ok)} />

      <AdminTable
        caption="Marques"
        head={
          <>
            <Th>Nom</Th>
            <Th>Identifiant</Th>
            <Th className="text-right">Produits</Th>
          </>
        }
      >
        {brands.map((brand) => (
          <tr key={brand.id} className={rowClass}>
            <Td>
              <Link
                href={`/admin/marques/${brand.id}`}
                className={stretchedLink}
              >
                {brand.name}
              </Link>
            </Td>
            <Td className="font-mono text-caption">{brand.slug}</Td>
            <Td className="text-right tabular-nums">{brand.productCount}</Td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
