import manifest from "@/data/_photos-manifest.json";
import { photosMeta } from "./photos-meta";

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  camera?: string;
  film?: string;
  location?: string;
}

type ManifestEntry = { file: string; src: string; width: number; height: number };

/**
 * Merges auto-discovered photos (from build-time scan) with manual metadata.
 * Any image in public/images/photos/ appears automatically.
 * Add metadata in photos-meta.ts to enrich entries.
 */
export const photosData: Photo[] = (manifest as ManifestEntry[]).map((entry) => {
  const meta = photosMeta[entry.file] ?? {};
  return {
    src: entry.src,
    width: entry.width,
    height: entry.height,
    alt: meta.alt ?? entry.file.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
    ...(meta.camera && { camera: meta.camera }),
    ...(meta.film && { film: meta.film }),
    ...(meta.location && { location: meta.location }),
  };
});
