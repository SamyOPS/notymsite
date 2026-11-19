import type { CategoryOption } from "@/lib/admin/data";

/**
 * Options d'une liste de catégories : chaque univers, puis ses catégories.
 * « filter » : choisir un univers inclut ses catégories ; « assign » : le
 * produit est rattaché directement à l'univers.
 */
export function CategoryOptions({
  categories,
  mode,
}: {
  categories: CategoryOption[];
  mode: "filter" | "assign";
}) {
  const universes = categories.filter((c) => c.parent_id === null);
  return universes.map((universe) => {
    const children = categories.filter((c) => c.parent_id === universe.id);
    const suffix =
      children.length === 0
        ? ""
        : mode === "filter"
          ? " (tout l'univers)"
          : " (directement dans l'univers)";
    return (
      <optgroup key={universe.id} label={universe.name}>
        <option value={universe.id}>
          {universe.name}
          {suffix}
        </option>
        {children.map((child) => (
          <option key={child.id} value={child.id}>
            {child.name}
          </option>
        ))}
      </optgroup>
    );
  });
}
