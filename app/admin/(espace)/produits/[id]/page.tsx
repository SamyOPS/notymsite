import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteForm } from "@/components/admin/form-ui";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ButtonLink } from "@/components/ui/button";
import {
  getAdminProduct,
  listBrandOptions,
  listCategoryOptions,
} from "@/lib/admin/data";
import { productFormValues } from "@/lib/admin/form-values";
import { deleteProduct, saveProduct } from "../actions";
import { CategoryOptions } from "../category-options";
import { ProductForm } from "../product-form";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Modifier un produit" };

export default async function EditProductPage({
  params,
}: PageProps<"/admin/produits/[id]">) {
  const { id } = await params;
  const [product, brands, categories] = await Promise.all([
    getAdminProduct(id),
    listBrandOptions(),
    listCategoryOptions(),
  ]);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={product.name}
        back={{ href: "/admin/produits", label: "Produits" }}
        actions={
          product.published && (
            <ButtonLink
              href={`/produit/${product.slug}`}
              target="_blank"
              variant="secondary"
            >
              Voir la page
              <ExternalLink aria-hidden />
            </ButtonLink>
          )
        }
      />
      <ProductForm
        action={saveProduct.bind(null, product.id)}
        initial={productFormValues(product)}
        isNew={false}
        brands={brands}
        categoryOptions={
          <CategoryOptions categories={categories} mode="assign" />
        }
      />
      <section
        aria-label="Supprimer le produit"
        className="flex flex-col gap-3 border-t border-line pt-6"
      >
        <p className="max-w-2xl text-body text-ink-muted">
          Pour retirer temporairement un produit du site, décochez plutôt «
          Visible sur le site ».
        </p>
        <DeleteForm
          action={deleteProduct.bind(null, product.id)}
          confirmMessage={`Supprimer définitivement « ${product.name} » et ses photos ?`}
          label="Supprimer le produit"
        />
      </section>
    </div>
  );
}
