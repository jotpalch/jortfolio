/**
 * Manual photo metadata.
 * Key = filename. Photos are auto-discovered — this file is optional enrichment.
 * Camera from EXIF will be overridden by values here.
 */
export const photosMeta: Record<
  string,
  { alt?: string; camera?: string; film?: string; location?: string }
> = {
  "000017000010.jpg": { camera: "Fuji Cardia Hite", film: "Kodak Portra 400" },
  "000017000011.jpg": { camera: "Fuji Cardia Hite", film: "Kodak Portra 400" },
  "000017000012.jpg": { camera: "Fuji Cardia Hite", film: "Kodak Portra 400" },
  "000017000013.jpg": { camera: "Fuji Cardia Hite", film: "Kodak Portra 400" },
  "000017000014.jpg": { camera: "Fuji Cardia Hite", film: "Kodak Portra 400" },
  "000017000015.jpg": { camera: "Fuji Cardia Hite", film: "Kodak Portra 400" },
  "000017000017.jpg": { camera: "Fuji Cardia Hite", film: "Kodak Portra 400" },
  "000017000018.jpg": { camera: "Fuji Cardia Hite", film: "Kodak Portra 400" },
  "R0000028.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000260.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000262.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000266.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000267.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000284.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000317.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000325.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000330.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000338.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000353.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000355.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000359.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000360.JPG": { camera: "Ricoh GR IIIx HDF" },
  "R0000418.JPG": { camera: "Ricoh GR IIIx HDF" },
};
