import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { listCategoryOptions } from "@/lib/admin/data";
import { categoryFormValues } from "@/lib/admin/form-values";
import { saveCategory } from "../actions";
import { CategoryForm } from "../category-form";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Nouvelle catégorie" };

export default async function NewCategoryPage() {
  const categories = await listCategoryOptions();
  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Nouvelle catégorie"
        back={{ href: "/admin/categories", label: "Catégories" }}
      />
      <CategoryForm
        action={saveCategory.bind(null, null)}
        initial={categoryFormValues()}
        isNew
        universes={categories.filter((c) => c.parent_id === null)}
        hasChildren={false}
      />
    </div>
  );
}
