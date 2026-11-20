/**
 * Prépare une photo dans le navigateur avant l'envoi : réduite à 1200 px de
 * côté au plus, sur fond blanc, en WebP (JPEG si le navigateur ne sait pas
 * produire de WebP). Une photo de téléphone de 5 Mo pèse ensuite ~100 Ko.
 *
 * 1200 px suffit : la plus grande photo du site (fiche produit) s'affiche en
 * 600 px, soit 1200 px sur un écran haute définition. Cela ménage le stockage
 * Supabase (1 Go sur le plan gratuit).
 */

const MAX_SIDE = 1200;
const QUALITY = 0.85;

export type PreparedImage = { blob: Blob; extension: "webp" | "jpg" };

function toBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`« ${file.name} » n'est pas une image.`);
  }
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(
      `« ${file.name} » ne peut pas être lue. Utilisez une photo JPEG, PNG ou WebP.`,
    );
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context)
    throw new Error("Votre navigateur ne peut pas traiter l'image.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const webp = await toBlob(canvas, "image/webp");
  if (webp?.type === "image/webp") return { blob: webp, extension: "webp" };
  const jpeg = await toBlob(canvas, "image/jpeg");
  if (jpeg) return { blob: jpeg, extension: "jpg" };
  throw new Error("Votre navigateur ne peut pas traiter l'image.");
}
