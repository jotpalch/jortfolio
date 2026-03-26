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
  date?: string;
  focalLength?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
}

type ManifestEntry = {
  file: string; src: string; width: number; height: number;
  camera?: string; date?: string; focalLength?: string;
  aperture?: string; shutter?: string; iso?: string;
};

export const photosData: Photo[] = (manifest as ManifestEntry[]).map((entry) => {
  const meta = photosMeta[entry.file] ?? {};
  return {
    src: entry.src,
    width: entry.width,
    height: entry.height,
    alt: meta.alt ?? entry.file.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
    camera: meta.camera ?? entry.camera,
    ...(meta.film && { film: meta.film }),
    ...(meta.location && { location: meta.location }),
    ...(entry.date && { date: entry.date }),
    ...(entry.focalLength && { focalLength: entry.focalLength }),
    ...(entry.aperture && { aperture: entry.aperture }),
    ...(entry.shutter && { shutter: entry.shutter }),
    ...(entry.iso && { iso: entry.iso }),
  };
});
