import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/shop/catalog-view";
import { getCategories, getCategoryBySlug } from "@/lib/catalog/queries";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ categorie: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/catalogue/[categorie]">): Promise<Metadata> {
  const { categorie } = await params;
  const category = await getCategoryBySlug(categorie);
  if (!category)
    return { title: "Catégorie introuvable", robots: { index: false } };
  return {
    title: `${category.name} en gros`,
    description: `${category.name} pour les professionnels : ${category.description}. Devis sur demande.`,
    alternates: { canonical: `/catalogue/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/catalogue/[categorie]">) {
  const { categorie } = await params;
  const category = await getCategoryBySlug(categorie);
  if (!category) notFound();
  return <CatalogView category={category} searchParams={searchParams} />;
}
