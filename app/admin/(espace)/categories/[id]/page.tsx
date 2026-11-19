import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteForm } from "@/components/admin/form-ui";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminCategory, listCategoryOptions } from "@/lib/admin/data";
import { categoryFormValues } from "@/lib/admin/form-values";
import { deleteCategory, saveCategory } from "../actions";
import { CategoryForm } from "../category-form";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Modifier une catégorie" };

export default async function EditCategoryPage({
  params,
}: PageProps<"/admin/categories/[id]">) {
  const { id } = await params;
  const [category, categories] = await Promise.all([
    getAdminCategory(id),
    listCategoryOptions(),
  ]);
  if (!category) notFound();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={category.name}
        back={{ href: "/admin/categories", label: "Catégories" }}
      />
      <CategoryForm
        action={saveCategory.bind(null, category.id)}
        initial={categoryFormValues(category)}
        isNew={false}
        universes={categories.filter(
          (c) => c.parent_id === null && c.id !== category.id,
        )}
        hasChildren={categories.some((c) => c.parent_id === category.id)}
      />
      <section
        aria-label="Supprimer la catégorie"
        className="border-t border-line pt-6"
      >
        <DeleteForm
          action={deleteCategory.bind(null, category.id)}
          confirmMessage={`Supprimer « ${category.name} » ?`}
          label="Supprimer la catégorie"
        />
      </section>
    </div>
  );
}
