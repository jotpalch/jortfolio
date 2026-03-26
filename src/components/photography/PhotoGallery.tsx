"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { photosData, type Photo } from "@/data/photos";
import { optimizedSrc, getBlurDataURL } from "@/lib/photo-utils";
import { Camera, Film, MapPin } from "lucide-react";

type FilterType = "all" | "digital" | "film";

// ─── Geometry ───────────────────────────────────────────
const COLUMN_WIDTH = 200;
const TILE_H_SHORT = 145;
const TILE_H_TALL = 220;
const RADIUS = 2000;
const NUM_COLUMNS = Math.round((2 * Math.PI * RADIUS) / COLUMN_WIDTH); // ~63 for seamless
const PERSPECTIVE = 3200;
const PHOTOS_PER_COL = 7;
const IDLE_SPEED = 0.006;
const SPRING_CONFIG = { stiffness: 60, damping: 25 };

// Vertical stagger offsets per column (px) — creates brick-like irregularity
function getStagger(colIndex: number): number {
  // Pseudo-random stagger based on column index
  const offsets = [0, -40, 15, -25, 35, -10, 20, -35, 5, -20, 30, -15, 10, -30];
  return offsets[colIndex % offsets.length];
}

// ─── Build column data ──────────────────────────────────
function buildColumns(photos: Photo[]): Photo[][] {
  if (photos.length === 0) return [];
  const cols: Photo[][] = Array.from({ length: NUM_COLUMNS }, () => []);
  for (let c = 0; c < NUM_COLUMNS; c++) {
    for (let r = 0; r < PHOTOS_PER_COL; r++) {
      cols[c].push(photos[(c * 3 + r * 7) % photos.length]);
    }
  }
  return cols;
}

// ─── Photo Tile (always rectangular) ────────────────────
function PhotoTile({
  photo,
  height,
  onPhotoClick,
  hoveredPhoto,
  setHoveredPhoto,
}: {
  photo: Photo;
  height: number;
  onPhotoClick: (photo: Photo) => void;
  hoveredPhoto: Photo | null;
  setHoveredPhoto: (p: Photo | null) => void;
}) {
  const isHovered = hoveredPhoto === photo;
  const siblingHovered = hoveredPhoto !== null && hoveredPhoto !== photo;

  return (
    <div
      className="relative cursor-pointer overflow-hidden"
      style={{ width: COLUMN_WIDTH, height }}
      onClick={(e) => {
        e.stopPropagation();
        onPhotoClick(photo);
      }}
      onMouseEnter={() => setHoveredPhoto(photo)}
      onMouseLeave={() => setHoveredPhoto(null)}
    >
      <Image
        src={optimizedSrc(photo.src, "sm")}
        alt={photo.alt}
        fill
        placeholder={getBlurDataURL(photo.src) ? "blur" : undefined}
        blurDataURL={getBlurDataURL(photo.src)}
        className={`object-cover transition-all duration-700 ${
          siblingHovered ? "brightness-[0.3] saturate-[0.1]" : ""
        } ${isHovered ? "scale-110 brightness-110" : "scale-100"}`}
        sizes={`${COLUMN_WIDTH}px`}
      />
      <div
        className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="p-2.5">
          <p className="text-xs font-medium text-white drop-shadow-lg">{photo.alt}</p>
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
            {photo.camera && (
              <span className="flex items-center gap-1 text-[10px] text-white/80">
                <Camera className="h-2.5 w-2.5" /> {photo.camera}
              </span>
            )}
            {photo.film && (
              <span className="flex items-center gap-1 text-[10px] text-white/80">
                <Film className="h-2.5 w-2.5" /> {photo.film}
              </span>
            )}
            {photo.location && (
              <span className="flex items-center gap-1 text-[10px] text-white/80">
                <MapPin className="h-2.5 w-2.5" /> {photo.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dome Wall ──────────────────────────────────────────
function DomeWall({
  photos,
  hoveredPhoto,
  setHoveredPhoto,
  onPhotoClick,
}: {
  photos: Photo[];
  hoveredPhoto: Photo | null;
  setHoveredPhoto: (p: Photo | null) => void;
  onPhotoClick: (photo: Photo) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const angleYRef = useRef(0);
  const angleXRef = useRef(0);
  const velocityYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastDragXRef = useRef(0);
  const lastDragYRef = useRef(0);
  const rafRef = useRef(0);

  const rotateYVal = useMotionValue(0);
  const rotateXVal = useMotionValue(0);
  const springY = useSpring(rotateYVal, SPRING_CONFIG);
  const springX = useSpring(rotateXVal, { stiffness: 40, damping: 20 });

  const columns = useMemo(() => buildColumns(photos), [photos]);

  // Animation loop: idle spin + momentum after drag
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      if (!prefersReduced) {
        if (!isDraggingRef.current) {
          // Apply momentum friction
          if (Math.abs(velocityYRef.current) > 0.001) {
            angleYRef.current += velocityYRef.current;
            velocityYRef.current *= 0.97; // friction
          } else {
            // Idle drift when momentum is gone
            velocityYRef.current = 0;
            angleYRef.current += IDLE_SPEED;
          }
          // Vertical tilt decays back to 0
          angleXRef.current *= 0.95;
        }
      }

      rotateYVal.set(angleYRef.current);
      rotateXVal.set(angleXRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [rotateYVal, rotateXVal]);

  // Drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    velocityYRef.current = 0;
    lastDragXRef.current = e.clientX;
    lastDragYRef.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastDragXRef.current;
    const dy = e.clientY - lastDragYRef.current;
    lastDragXRef.current = e.clientX;
    lastDragYRef.current = e.clientY;

    const sensitivity = 0.15;
    angleYRef.current -= dx * sensitivity;
    angleXRef.current = Math.max(-12, Math.min(12, angleXRef.current + dy * 0.08));
    velocityYRef.current = -dx * sensitivity; // store for momentum
  }, []);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full cursor-grab overflow-hidden bg-black active:cursor-grabbing"
      style={{
        perspective: `${PERSPECTIVE}px`,
        perspectiveOrigin: "50% 50%",
        height: "100vh",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Vignette — heavy fade on all edges for dome feel */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* Rotating cylinder of columns */}
      <motion.div
        className="relative h-full w-full"
        style={{
          rotateY: springY,
          rotateX: springX,
          transformStyle: "preserve-3d",
        }}
      >
        {columns.map((colPhotos, i) => {
          const angle = (i / NUM_COLUMNS) * 360;
          const stagger = getStagger(i);

          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: COLUMN_WIDTH,
                marginLeft: -COLUMN_WIDTH / 2,
                transform: `rotateY(${angle}deg) translateZ(${-RADIUS}px) translateY(${stagger}px)`,
                backfaceVisibility: "hidden",
                // Center the column strip vertically
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                // Offset so the column is centered around the midpoint
                marginTop: -(PHOTOS_PER_COL * TILE_H_SHORT) / 2,
              }}
            >
              {colPhotos.map((photo, j) => {
                const aspect = photo.width / photo.height;
                const h = aspect >= 1 ? TILE_H_SHORT : TILE_H_TALL;
                return (
                  <PhotoTile
                    key={`${i}-${j}`}
                    photo={photo}
                    height={h}
                    onPhotoClick={onPhotoClick}
                    hoveredPhoto={hoveredPhoto}
                    setHoveredPhoto={setHoveredPhoto}
                  />
                );
              })}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

// ─── Mobile ─────────────────────────────────────────────
function MobileGallery({
  photos,
  onPhotoClick,
}: {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}) {
  return (
    <div className="grid min-h-screen grid-cols-2 gap-0">
      {[...photos, ...photos].map((photo, i) => {
        const aspect = photo.width / photo.height;
        const h = aspect >= 1 ? 140 : 200;
        return (
          <div
            key={`${photo.src}-${i}`}
            className="relative cursor-pointer overflow-hidden"
            style={{ height: h }}
            onClick={() => onPhotoClick(photo)}
          >
            <Image
              src={optimizedSrc(photo.src, "sm")}
              alt={photo.alt}
              fill
              placeholder={getBlurDataURL(photo.src) ? "blur" : undefined}
              blurDataURL={getBlurDataURL(photo.src)}
              className="object-cover"
              sizes="50vw"
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── Main export ────────────────────────────────────────
export default function PhotoGallery() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [hoveredPhoto, setHoveredPhoto] = useState<Photo | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const filteredPhotos = photosData.filter((p) => {
    if (filter === "digital") return !!p.camera;
    if (filter === "film") return !!p.film;
    return true;
  });

  const openLightbox = useCallback((photo: Photo) => {
    const globalIndex = photosData.indexOf(photo);
    setLightboxIndex(globalIndex);
    setLightboxOpen(true);
  }, []);

  const filters: [FilterType, string][] = [
    ["all", "All"],
    ["digital", "Ricoh GR3x"],
    ["film", "Negative Film"],
  ];

  return (
    <div className="relative">
      {/* Floating filter — top left */}
      <div className="absolute left-6 top-6 z-30">
        <div className="flex gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 shadow-2xl backdrop-blur-xl">
          {filters.map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setFilter(key);
                setHoveredPhoto(null);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                filter === key
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="self-center pl-2 font-mono text-[10px] text-white/40">
            {filteredPhotos.length}
          </span>
        </div>
      </div>

      {isMobile ? (
        <MobileGallery photos={filteredPhotos} onPhotoClick={openLightbox} />
      ) : (
        <DomeWall
          photos={filteredPhotos}
          hoveredPhoto={hoveredPhoto}
          setHoveredPhoto={setHoveredPhoto}
          onPhotoClick={openLightbox}
        />
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={photosData.map((photo) => ({
          src: optimizedSrc(photo.src, "lg"),
          alt: photo.alt,
          width: photo.width * 800,
          height: photo.height * 800,
        }))}
      />
    </div>
  );
}
