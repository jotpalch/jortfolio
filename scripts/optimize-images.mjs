#!/usr/bin/env node
/**
 * Build-time image optimizer.
 *
 * 1. Scans public/images/photos/ for all images
 * 2. Generates optimized WebP variants (sm 400w, lg 1600w) in opt/
 * 3. Writes _photos-manifest.json — auto-discovered photos with dimensions + blur
 * 4. Writes _blur-map.json — blur placeholders for components
 *
 * New photos uploaded via GitHub web UI are auto-discovered on next build.
 * Metadata (alt, camera, film, location) can be added in src/data/photos-meta.ts.
 */

import { readdir, mkdir, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const PHOTOS_DIR = join(ROOT, "public/images/photos");
const OPT_DIR = join(PHOTOS_DIR, "opt");
const BLUR_MAP_PATH = join(ROOT, "src/data/_blur-map.json");
const MANIFEST_PATH = join(ROOT, "src/data/_photos-manifest.json");

const SIZES = [
  { suffix: "sm", width: 400, quality: 80 },
  { suffix: "lg", width: 1600, quality: 85 },
];

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff"]);

async function run() {
  await mkdir(OPT_DIR, { recursive: true });

  // Collect source images (skip opt/ directory)
  const entries = await readdir(PHOTOS_DIR, { withFileTypes: true });
  const images = entries
    .filter((e) => e.isFile() && IMAGE_EXTS.has(parse(e.name).ext.toLowerCase()))
    .map((e) => e.name)
    .sort();

  if (images.length === 0) {
    console.log("No images found in", PHOTOS_DIR);
    // Write empty files so build doesn't break
    await writeFile(BLUR_MAP_PATH, "{}");
    await writeFile(MANIFEST_PATH, "[]");
    return;
  }

  console.log(`Optimizing ${images.length} images...\n`);

  const blurMap = {};
  const manifest = [];

  for (const file of images) {
    const { name } = parse(file);
    const src = join(PHOTOS_DIR, file);
    const meta = await sharp(src).metadata();

    // Generate sized WebP variants
    for (const { suffix, width, quality } of SIZES) {
      const outPath = join(OPT_DIR, `${name}-${suffix}.webp`);
      const resizeWidth = meta.width > width ? width : meta.width;

      await sharp(src)
        .resize(resizeWidth, null, { withoutEnlargement: true })
        .webp({ quality })
        .toFile(outPath);
    }

    // Generate tiny blur placeholder
    const blurBuf = await sharp(src)
      .resize(16, null, { withoutEnlargement: true })
      .webp({ quality: 20 })
      .toBuffer();

    const blurDataURL = `data:image/webp;base64,${blurBuf.toString("base64")}`;

    blurMap[file] = { blurDataURL, width: meta.width, height: meta.height };

    // Manifest entry — auto-discovered photo
    manifest.push({
      file,
      src: `/images/photos/${file}`,
      width: meta.width,
      height: meta.height,
    });

    console.log(`  ✓ ${file} (${meta.width}×${meta.height})`);
  }

  await writeFile(BLUR_MAP_PATH, JSON.stringify(blurMap, null, 2));
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`\n✓ ${images.length} images → ${SIZES.length} variants each`);
  console.log(`  _blur-map.json    — blur placeholders`);
  console.log(`  _photos-manifest.json — auto-discovered photos`);
}

run().catch((err) => {
  console.error("Image optimization failed:", err);
  process.exit(1);
});
