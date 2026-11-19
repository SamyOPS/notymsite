/** Format des adresses (slugs) : minuscules, chiffres, tirets simples. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Adresse lisible à partir d'un nom :
 * « Coca-Cola 1,5 L » → « coca-cola-1-5-l », « B'lue » → « blue ».
 */
export function slugify(value: string, max = 60): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .slice(0, max)
    .replace(/-+$/, "");
}
