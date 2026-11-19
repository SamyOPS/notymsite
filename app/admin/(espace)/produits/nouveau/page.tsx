import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { listBrandOptions, listCategoryOptions } from "@/lib/admin/data";
import { productFormValues } from "@/lib/admin/form-values";
import { saveProduct } from "../actions";
import { CategoryOptions } from "../category-options";
import { ProductForm } from "../product-form";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Nouveau produit" };

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    listBrandOptions(),
    listCategoryOptions(),
  ]);
  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Nouveau produit"
        back={{ href: "/admin/produits", label: "Produits" }}
      />
      <ProductForm
        action={saveProduct.bind(null, null)}
        initial={productFormValues()}
        isNew
        brands={brands}
        categoryOptions={
          <CategoryOptions categories={categories} mode="assign" />
        }
      />
    </div>
  );
}
