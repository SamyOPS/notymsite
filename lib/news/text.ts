/**
 * Mise en forme du texte des actualités, saisi en texte brut dans l'admin :
 * une ligne vide sépare deux paragraphes, un simple retour à la ligne est
 * conservé dans le paragraphe.
 */
export function toParagraphs(content: string): string[][] {
  return content
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.length > 0);
}

const longDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});

/** « 2026-11-19T10:00:00Z » → « 19 novembre 2026 » (heure de Paris). */
export function formatLongDate(iso: string): string {
  return longDate.format(new Date(iso));
}
