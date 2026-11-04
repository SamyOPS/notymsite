export type PageItem = number | "ellipsis";

/**
 * Pages à afficher : toujours la première et la dernière, la page courante
 * et ses voisines, avec des ellipses pour les trous de plus d'une page.
 * Ex. page 6 sur 12 → [1, "ellipsis", 5, 6, 7, "ellipsis", 12]
 */
export function paginationRange(
  current: number,
  total: number,
  siblings = 1,
): PageItem[] {
  if (total <= 1) return [1];
  const page = Math.min(Math.max(1, current), total);

  const pages = new Set<number>([1, total]);
  for (let p = page - siblings; p <= page + siblings; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];
  let previous = 0;
  for (const p of sorted) {
    if (p - previous === 2) items.push(p - 1);
    else if (p - previous > 2) items.push("ellipsis");
    items.push(p);
    previous = p;
  }
  return items;
}

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

/** Construit l'URL d'une page en conservant les autres paramètres (filtres, tri). */
export function pageHref(
  pathname: string,
  searchParams: SearchParamsRecord,
  page: number,
  param = "page",
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === param || value === undefined) continue;
    for (const v of Array.isArray(value) ? value : [value])
      query.append(key, v);
  }
  if (page > 1) query.set(param, String(page));
  const qs = query.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
