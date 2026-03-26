import blurMap from "@/data/_blur-map.json";

const blurData = blurMap as Record<
  string,
  { blurDataURL: string; width: number; height: number }
>;

/** Convert original src to optimized WebP path */
export function optimizedSrc(
  src: string,
  size: "sm" | "lg" = "sm"
): string {
  // "/images/photos/photo-01.jpg" → "/images/photos/opt/photo-01-sm.webp"
  const dir = src.substring(0, src.lastIndexOf("/"));
  const filename = src.substring(src.lastIndexOf("/") + 1);
  const name = filename.substring(0, filename.lastIndexOf("."));
  return `${dir}/opt/${name}-${size}.webp`;
}

/** Get blur placeholder for a photo src */
export function getBlurDataURL(src: string): string | undefined {
  const filename = src.substring(src.lastIndexOf("/") + 1);
  return blurData[filename]?.blurDataURL;
}

/** Get actual dimensions from blur map */
export function getActualDimensions(
  src: string
): { width: number; height: number } | undefined {
  const filename = src.substring(src.lastIndexOf("/") + 1);
  const entry = blurData[filename];
  if (entry) return { width: entry.width, height: entry.height };
  return undefined;
}
