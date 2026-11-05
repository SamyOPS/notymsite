/**
 * Génère les icônes du site à partir du logo (public/brand/notym-logo.png) :
 *   app/favicon.ico    16, 32 et 48 px (format ICO, images PNG)
 *   app/icon.png       512 px
 *   app/apple-icon.png 180 px (écran d'accueil iOS)
 *
 * Le logo est utilisé entier, sans déformation ni recadrage, centré sur un
 * carré blanc (le lettrage noir resterait invisible sur un onglet sombre).
 *
 * Usage : npm run icons
 */
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "public/brand/notym-logo.png";

/** Carré blanc avec le logo centré, occupant `ratio` de la largeur. */
async function tile(size, ratio) {
  const logo = await sharp(SOURCE)
    .resize({ width: Math.round(size * ratio), fit: "inside" })
    .png()
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: "#ffffff" },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** Fichier ICO contenant des images PNG (format accepté par tous les navigateurs actuels). */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // réservé
  header.writeUInt16LE(1, 2); // type : icône
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // largeur
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // hauteur
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // réservé
    entry.writeUInt16LE(1, 4); // plans
    entry.writeUInt16LE(32, 6); // bits par pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const favicon = await Promise.all(
  [16, 32, 48].map(async (size) => ({ size, data: await tile(size, 0.94) })),
);
await writeFile("app/favicon.ico", ico(favicon));
await writeFile("app/icon.png", await tile(512, 0.86));
await writeFile("app/apple-icon.png", await tile(180, 0.8));

console.log(
  "Icônes générées : app/favicon.ico, app/icon.png, app/apple-icon.png",
);
