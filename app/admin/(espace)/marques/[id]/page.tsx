import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteForm } from "@/components/admin/form-ui";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminBrand } from "@/lib/admin/data";
import { brandFormValues } from "@/lib/admin/form-values";
import { deleteBrand, saveBrand } from "../actions";
import { BrandForm } from "../brand-form";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Modifier une marque" };

export default async function EditBrandPage({
  params,
}: PageProps<"/admin/marques/[id]">) {
  const { id } = await params;
  const brand = await getAdminBrand(id);
  if (!brand) notFound();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={brand.name}
        back={{ href: "/admin/marques", label: "Marques" }}
      />
      <BrandForm
        action={saveBrand.bind(null, brand.id)}
        initial={brandFormValues(brand)}
        isNew={false}
      />
      <section
        aria-label="Supprimer la marque"
        className="border-t border-line pt-6"
      >
        <DeleteForm
          action={deleteBrand.bind(null, brand.id)}
          confirmMessage={`Supprimer la marque « ${brand.name} » ?`}
          label="Supprimer la marque"
        />
      </section>
    </div>
  );
}
