import type { Metadata } from "next";
import { CatalogView } from "@/components/shop/catalog-view";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Catalogue Notym pour les professionnels : sodas, eaux, énergisants, jus et snacks des grandes marques. Prix indicatifs HT et devis sur demande.",
  alternates: { canonical: "/catalogue" },
};

export default function CatalogPage({ searchParams }: PageProps<"/catalogue">) {
  return <CatalogView category={null} searchParams={searchParams} />;
}
