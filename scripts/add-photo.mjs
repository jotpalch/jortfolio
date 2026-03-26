#!/usr/bin/env node
/**
 * Add a new photo to the portfolio.
 *
 * Usage:
 *   node scripts/add-photo.mjs <image-path> [--alt "desc"] [--camera "model"] [--film "stock"] [--location "place"]
 *
 * What it does:
 *   1. Copies the image to public/images/photos/
 *   2. Reads EXIF to auto-detect: camera model, dimensions
 *   3. Appends an entry to src/data/photos.ts
 *   4. Runs the optimizer to generate WebP variants + blur placeholder
 *
 * Example:
 *   node scripts/add-photo.mjs ~/Desktop/DSC0001.jpg --alt "Sunset at Tamsui" --location "Taipei"
 *   node scripts/add-photo.mjs ~/Desktop/scan-001.tiff --alt "Night market" --film "Kodak Portra 400" --location "Taipei"
 */

import { copyFile, readFile, writeFile } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const PHOTOS_DIR = join(ROOT, "public/images/photos");
const PHOTOS_TS = join(ROOT, "src/data/photos.ts");

function parseArgs(argv) {
  const args = argv.slice(2);
  const result = { imagePath: null, alt: "", camera: "", film: "", location: "" };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--alt" && args[i + 1]) { result.alt = args[++i]; }
    else if (args[i] === "--camera" && args[i + 1]) { result.camera = args[++i]; }
    else if (args[i] === "--film" && args[i + 1]) { result.film = args[++i]; }
    else if (args[i] === "--location" && args[i + 1]) { result.location = args[++i]; }
    else if (!args[i].startsWith("--")) { result.imagePath = args[i]; }
  }
  return result;
}

async function run() {
  const args = parseArgs(process.argv);

  if (!args.imagePath) {
    console.log("Usage: node scripts/add-photo.mjs <image-path> [--alt \"...\"] [--camera \"...\"] [--film \"...\"] [--location \"...\"]");
    process.exit(1);
  }

  const ext = extname(args.imagePath).toLowerCase();
  const origName = basename(args.imagePath);

  // Generate a clean filename
  const destName = origName.replace(/\s+/g, "-").toLowerCase();
  const destPath = join(PHOTOS_DIR, destName);

  // Copy image
  await copyFile(args.imagePath, destPath);
  console.log(`Copied → public/images/photos/${destName}`);

  // Read metadata with sharp
  const meta = await sharp(destPath).metadata();
  const width = meta.width;
  const height = meta.height;

  // Try to extract camera model from EXIF
  let exifCamera = "";
  if (meta.exif) {
    try {
      // Parse EXIF for camera model (tag 0x0110)
      const exifStr = meta.exif.toString("latin1");
      const modelMatch = exifStr.match(/[\x00]([A-Za-z][\w\s\-\.]+(?:GR|RICOH|Canon|Nikon|Sony|Fuji|Leica|Olympus|Pentax|Panasonic)[\w\s\-\.]*?)[\x00]/i)
        || exifStr.match(/(?:RICOH|Canon|Nikon|Sony|FUJIFILM|Leica|OLYMPUS|PENTAX|Panasonic)[^\x00]{0,40}/i);
      if (modelMatch) exifCamera = modelMatch[0].replace(/\x00/g, "").trim();
    } catch {}
  }

  const camera = args.camera || exifCamera;
  const alt = args.alt || destName.replace(ext, "").replace(/[-_]/g, " ");

  // Build the entry
  const optionalFields = [];
  if (camera) optionalFields.push(`    camera: ${JSON.stringify(camera)},`);
  if (args.film) optionalFields.push(`    film: ${JSON.stringify(args.film)},`);
  if (args.location) optionalFields.push(`    location: ${JSON.stringify(args.location)},`);

  const entry = `  {
    src: "/images/photos/${destName}",
    width: ${width},
    height: ${height},
    alt: ${JSON.stringify(alt)},
${optionalFields.join("\n")}
  },`;

  // Append to photos.ts (before the closing ];)
  let tsContent = await readFile(PHOTOS_TS, "utf-8");
  tsContent = tsContent.replace(/\n\];\s*$/, `\n${entry}\n];\n`);
  await writeFile(PHOTOS_TS, tsContent);

  console.log(`Added to photos.ts: ${alt} (${width}x${height})`);
  if (camera) console.log(`  Camera: ${camera}`);
  if (args.film) console.log(`  Film: ${args.film}`);
  if (args.location) console.log(`  Location: ${args.location}`);

  console.log(`\nRun "npm run optimize" to generate WebP variants.`);
  console.log(`Edit src/data/photos.ts to update any metadata.`);
}

run().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
