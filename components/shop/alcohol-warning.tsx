import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/** Mention sanitaire obligatoire sur les pages présentant de l'alcool (loi Évin). */
export function AlcoholWarning({ className }: { className?: string }) {
  return (
    <p className={cn("text-body font-semibold text-ink", className)}>
      {site.alcohol.warning}
    </p>
  );
}

/** Vrai pour l'univers Alcools et ses catégories. */
export function isAlcoholCategory(
  category: { slug: string; parentSlug: string | null } | null | undefined,
): boolean {
  if (!category) return false;
  return (
    category.slug === site.alcohol.universe ||
    category.parentSlug === site.alcohol.universe
  );
}
