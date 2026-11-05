/** Alphabet sans caractères ambigus (pas de 0/O, 1/I/L). */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/**
 * Référence lisible d'une demande, à communiquer au client :
 * « D-20261105-7K3F » (D = devis, C = contact).
 */
export function createReference(
  prefix: "D" | "C",
  now: Date = new Date(),
  randomBytes: (size: number) => Uint8Array = (size) =>
    crypto.getRandomValues(new Uint8Array(size)),
): string {
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const suffix = [...randomBytes(4)]
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join("");
  return `${prefix}-${date}-${suffix}`;
}
