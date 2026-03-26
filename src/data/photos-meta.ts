/**
 * Manual photo metadata.
 * Key = filename (e.g. "photo-01.jpg").
 * Add alt text, camera, film, location here.
 * Photos are auto-discovered from public/images/photos/ — this file is optional enrichment.
 *
 * To add metadata for a new photo uploaded via GitHub:
 * 1. Upload the image to public/images/photos/
 * 2. Add an entry here with the filename as the key
 */
export const photosMeta: Record<
  string,
  { alt?: string; camera?: string; film?: string; location?: string }
> = {
  "photo-01.jpg": { alt: "Street scene", camera: "Ricoh GR3x HDF", location: "Hsinchu" },
  "photo-02.jpg": { alt: "Portrait in shadow", film: "Kodak Portra 400", location: "Taipei" },
  "photo-03.jpg": { alt: "City at dusk", camera: "Ricoh GR3x HDF", location: "Tokyo" },
  "photo-04.jpg": { alt: "Temple light", film: "Fuji Superia 400", location: "Kyoto" },
  "photo-05.jpg": { alt: "Rain reflections", camera: "Ricoh GR3x HDF", location: "Hsinchu" },
  "photo-06.jpg": { alt: "Quiet alley", film: "Kodak Gold 200", location: "Tainan" },
  "photo-07.jpg": { alt: "Night market glow", camera: "Ricoh GR3x HDF", location: "Taipei" },
  "photo-08.jpg": { alt: "Morning commute", film: "Kodak Portra 160", location: "Hsinchu" },
  "photo-09.jpg": { alt: "Window light", camera: "Ricoh GR3x HDF", location: "Taipei" },
  "photo-10.jpg": { alt: "Sunset pier", film: "Kodak Portra 400", location: "Kaohsiung" },
  "photo-11.jpg": { alt: "Coffee shop corner", camera: "Ricoh GR3x HDF", location: "Hsinchu" },
  "photo-12.jpg": { alt: "Stairway shadows", film: "Fuji C200", location: "Taipei" },
};
