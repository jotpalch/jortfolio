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
import exifReader from "exif-reader";

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

    // Get rotated dimensions (apply EXIF orientation)
    const rotatedBuf = await sharp(src).rotate().toBuffer();
    const meta = await sharp(rotatedBuf).metadata();

    // Generate sized WebP variants (with EXIF rotation applied)
    for (const { suffix, width, quality } of SIZES) {
      const outPath = join(OPT_DIR, `${name}-${suffix}.webp`);
      const resizeWidth = meta.width > width ? width : meta.width;

      await sharp(src)
        .rotate() // apply EXIF orientation
        .resize(resizeWidth, null, { withoutEnlargement: true })
        .webp({ quality })
        .toFile(outPath);
    }

    // Generate tiny blur placeholder
    const blurBuf = await sharp(src)
      .rotate()
      .resize(16, null, { withoutEnlargement: true })
      .webp({ quality: 20 })
      .toBuffer();

    const blurDataURL = `data:image/webp;base64,${blurBuf.toString("base64")}`;

    blurMap[file] = { blurDataURL, width: meta.width, height: meta.height };

    // Extract EXIF data
    const originalMeta = await sharp(src).metadata();
    let exif = {};
    if (originalMeta.exif) {
      try {
        const parsed = exifReader(originalMeta.exif);
        const e = parsed.Photo || {};
        const img = parsed.Image || {};
        exif = {
          date: e.DateTimeOriginal ? new Date(e.DateTimeOriginal).toISOString().split("T")[0] : undefined,
          camera: [img.Make, img.Model].filter(Boolean).map(s => s.trim()).join(" ").replace(/\s+/g, " ").trim() || undefined,
          focalLength: e.FocalLengthIn35mmFilm ? `${e.FocalLengthIn35mmFilm}mm` : e.FocalLength ? `${Math.round(e.FocalLength)}mm` : undefined,
          aperture: e.FNumber ? `f/${e.FNumber}` : undefined,
          shutter: e.ExposureTime ? (e.ExposureTime >= 1 ? `${e.ExposureTime}s` : `1/${Math.round(1 / e.ExposureTime)}s`) : undefined,
          iso: e.ISOSpeedRatings != null ? `ISO ${e.ISOSpeedRatings}` : (e.PhotographicSensitivity != null ? `ISO ${e.PhotographicSensitivity}` : undefined),
        };
        // Remove undefined fields
        Object.keys(exif).forEach((k) => exif[k] === undefined && delete exif[k]);
      } catch {}
    }

    // Manifest entry — uses rotated dimensions + EXIF
    manifest.push({
      file,
      src: `/images/photos/${file}`,
      width: meta.width,
      height: meta.height,
      ...exif,
    });

    const info = [exif.camera, exif.focalLength, exif.aperture, exif.iso, exif.date].filter(Boolean).join(" | ");
    console.log(`  ✓ ${file} (${meta.width}×${meta.height}) ${info}`);
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
