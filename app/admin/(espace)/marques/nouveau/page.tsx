import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/auth";
import { brandFormValues } from "@/lib/admin/form-values";
import { saveBrand } from "../actions";
import { BrandForm } from "../brand-form";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Nouvelle marque" };

export default async function NewBrandPage() {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Nouvelle marque"
        back={{ href: "/admin/marques", label: "Marques" }}
      />
      <BrandForm
        action={saveBrand.bind(null, null)}
        initial={brandFormValues()}
        isNew
      />
    </div>
  );
}
