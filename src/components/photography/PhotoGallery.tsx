"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { photosData, type Photo } from "@/data/photos";
import { optimizedSrc, getBlurDataURL } from "@/lib/photo-utils";

type FilterType = "all" | "digital" | "film";

// ─── Geometry ───────────────────────────────────────────
const RADIUS = 1400;
const TARGET_ROW_H = 400;
const GAP = 4; // px gap between photos
const IDLE_SPEED = 0.0002;
const DRAG_SENSITIVITY = 0.005;
const FRICTION = 0.97;
const EASE = 0.08; // lower = more smooth/laggy

// ─── Justified layout ───────────────────────────────────
type TileData = { photo: Photo; startAngle: number; arcWidth: number; h: number; y: number };

function buildJustifiedRows(photos: Photo[]): { tiles: TileData[]; totalH: number } {
  if (photos.length === 0) return { tiles: [], totalH: 0 };
  const circumference = 2 * Math.PI * RADIUS;
  const fullArc = Math.PI * 2;
  const tiles: TileData[] = [];

  const bestRows = Math.min(2, photos.length);
  const perRow = Math.ceil(photos.length / bestRows);
  let y = 0;

  // Each row: lay out photos at natural size, repeat until circle is full, stop before overlap
  for (let r = 0; r < bestRows; r++) {
    const rowPhotos = photos.slice(r * perRow, Math.min((r + 1) * perRow, photos.length));
    const rowItems = rowPhotos.map((p) => ({ photo: p, naturalW: TARGET_ROW_H * (p.width / p.height) }));
    const rowH = TARGET_ROW_H;
    const gapAngle = (GAP / circumference) * fullArc;

    let angleOffset = 0;
    let done = false;
    while (!done) {
      for (const item of rowItems) {
        const itemArc = (item.naturalW / circumference) * fullArc;
        // Stop if this photo would overlap past the circle
        if (angleOffset + itemArc > fullArc + 0.001) { done = true; break; }
        tiles.push({
          photo: item.photo,
          startAngle: angleOffset + gapAngle / 2,
          arcWidth: item.naturalW - GAP,
          h: rowH - GAP,
          y: y + GAP / 2,
        });
        angleOffset += itemArc;
      }
      // If one full set didn't fill the circle, keep repeating
      if (angleOffset >= fullArc - 0.001) done = true;
    }
    y += rowH;
  }

  return { tiles, totalH: y };
}

// ─── Three.js Dome Wall ─────────────────────────────────
function DomeWall({ photos, onPhotoClick, spinning }: { photos: Photo[]; onPhotoClick: (p: Photo) => void; spinning: boolean }) {
  const [hoverInfo, setHoverInfo] = useState<{ photo: Photo; x: number; y: number } | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    renderer: import("three").WebGLRenderer;
    scene: import("three").Scene;
    camera: import("three").PerspectiveCamera;
    cylinder: import("three").Group;
    tileMap: Map<import("three").Mesh, Photo>;
    THREE: typeof import("three");
    raf: number;
  } | null>(null);
  const angleYRef = useRef(0);
  const targetAngleYRef = useRef(0);
  const velocityYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const angleXRef = useRef(0);
  const dragDistRef = useRef(0);
  const initedKeyRef = useRef("");
  const texCacheRef = useRef<Map<string, import("three").Texture>>(new Map());
  const [sceneReady, setSceneReady] = useState(false);

  const { tiles, totalH } = useMemo(() => buildJustifiedRows(photos), [photos]);
  const photosKey = useMemo(() => photos.map((p) => p.src).join(","), [photos]);

  const spinningRef = useRef(false);
  spinningRef.current = spinning;

  // Scene setup — runs once
  useEffect(() => {
    const container = containerRef.current;
    if (!container || stateRef.current) return;
    let cancelled = false;

    import("three").then((THREE) => {
      if (cancelled) return;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 1, 5000);
      camera.position.set(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      const cylinder = new THREE.Group();
      scene.add(cylinder);

      const state = { renderer, scene, camera, cylinder, tileMap: new Map() as Map<import("three").Mesh, Photo>, THREE, raf: 0 };

      const tick = () => {
        if (spinningRef.current) {
          targetAngleYRef.current += 0.08;
        } else if (!isDraggingRef.current) {
          if (Math.abs(velocityYRef.current) > 0.0001) {
            targetAngleYRef.current += velocityYRef.current;
            velocityYRef.current *= FRICTION;
          } else {
            targetAngleYRef.current += IDLE_SPEED;
          }
          angleXRef.current *= 0.95;
        }
        angleYRef.current += (targetAngleYRef.current - angleYRef.current) * EASE;
        cylinder.rotation.y = angleYRef.current;
        cylinder.rotation.x = angleXRef.current;

        if (!isDraggingRef.current && !spinningRef.current) {
          const rect = container.getBoundingClientRect();
          const mx = ((mouseRef.current.x - rect.left) / rect.width) * 2 - 1;
          const my = -((mouseRef.current.y - rect.top) / rect.height) * 2 + 1;
          const rc = new THREE.Raycaster();
          rc.setFromCamera(new THREE.Vector2(mx, my), camera);
          const hits = rc.intersectObjects(cylinder.children);
          if (hits.length > 0) {
            const photo = state.tileMap.get(hits[0].object as import("three").Mesh);
            if (photo) setHoverInfo({ photo, x: mouseRef.current.x, y: mouseRef.current.y });
            else setHoverInfo(null);
          } else setHoverInfo(null);
        }

        renderer.render(scene, camera);
        state.raf = requestAnimationFrame(tick);
      };
      state.raf = requestAnimationFrame(tick);

      window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });

      stateRef.current = state;
      initedKeyRef.current = "";
      setSceneReady(true);
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tile update — runs on photo change, reuses scene (no stutter)
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    if (initedKeyRef.current === photosKey) return;
    initedKeyRef.current = photosKey;

    const { THREE, cylinder } = s;
    const loader = new THREE.TextureLoader();

    // Remove old tiles (keep scene + renderer)
    while (cylinder.children.length) {
      const c = cylinder.children[0];
      cylinder.remove(c);
      if (c instanceof THREE.Mesh) {
        c.geometry.dispose();
        (c.material as import("three").MeshBasicMaterial).dispose();
      }
    }

    const tileMap = new Map<import("three").Mesh, Photo>();
    const VERT_RADIUS = RADIUS * 3;

    for (const tile of tiles) {
      const arcLen = tile.arcWidth / RADIUS;
      const yCenter = tile.y + tile.h / 2 - totalH / 2;
      const positions: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];

      for (let iy = 0; iy <= 2; iy++) {
        const v = iy / 2;
        const localY = (0.5 - v) * tile.h;
        const worldY = -yCenter + localY;
        const vertAngle = worldY / VERT_RADIUS;
        const rScale = Math.cos(vertAngle);
        const yPos = Math.sin(vertAngle) * VERT_RADIUS;
        for (let ix = 0; ix <= 4; ix++) {
          const u = ix / 4;
          const a = tile.startAngle + u * arcLen;
          positions.push(Math.sin(a) * RADIUS * rScale, yPos, -Math.cos(a) * RADIUS * rScale);
          uvs.push(u, 1 - v);
        }
      }
      for (let iy = 0; iy < 2; iy++) {
        for (let ix = 0; ix < 4; ix++) {
          const a = iy * 5 + ix, b = a + 1, c = a + 5, d = c + 1;
          indices.push(a, c, b, b, c, d);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);

      const mat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      const mesh = new THREE.Mesh(geo, mat);
      cylinder.add(mesh);
      tileMap.set(mesh, tile.photo);

      // Use cached texture for instant swap
      const src = optimizedSrc(tile.photo.src, "lg");
      const cached = texCacheRef.current.get(src);
      if (cached) {
        mat.map = cached; mat.color.set(0xffffff); mat.needsUpdate = true;
      } else {
        loader.load(src, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          texCacheRef.current.set(src, tex);
          mat.map = tex; mat.color.set(0xffffff); mat.needsUpdate = true;
        });
      }
    }
    s.tileMap = tileMap;

    // Center camera on middle of photos (not the gap)
    if (tiles.length > 0) {
      const lastTile = tiles[tiles.length - 1];
      const maxAngle = lastTile.startAngle + lastTile.arcWidth / RADIUS;
      const centerAngle = maxAngle / 2;
      // Rotate cylinder so centerAngle faces camera (camera looks at angle 0)
      targetAngleYRef.current = -centerAngle;
      angleYRef.current = -centerAngle;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photosKey, tiles, totalH, sceneReady]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    velocityYRef.current = 0;
    dragDistRef.current = 0;
    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    const dy = e.clientY - lastYRef.current;
    dragDistRef.current += Math.abs(dx) + Math.abs(dy);
    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;
    targetAngleYRef.current -= dx * DRAG_SENSITIVITY;
    velocityYRef.current = -dx * DRAG_SENSITIVITY;
    angleXRef.current = Math.max(-0.3, Math.min(0.3, angleXRef.current - dy * 0.002));
  }, []);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Ignore click after drag
    if (dragDistRef.current > 5) return;

    const s = stateRef.current;
    const container = containerRef.current;
    if (!s || !container) return;

    const rect = container.getBoundingClientRect();
    const mouse = new s.THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    const raycaster = new s.THREE.Raycaster();
    raycaster.setFromCamera(mouse, s.camera);
    const hits = raycaster.intersectObjects(s.cylinder.children);
    if (hits.length > 0) {
      const photo = s.tileMap.get(hits[0].object as import("three").Mesh);
      if (photo) onPhotoClick(photo);
    }
  }, [onPhotoClick]);

  return (
    <div
      ref={containerRef}
      className="relative z-0 w-full cursor-grab bg-black active:cursor-grabbing"
      style={{ height: "100vh" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => { handlePointerUp(); setHoverInfo(null); }}
      onClick={handleClick}
    >
      {hoverInfo && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-white/10 bg-black/80 px-3 py-2 shadow-xl backdrop-blur-md"
          style={{ left: hoverInfo.x + 16, top: hoverInfo.y - 10 }}
        >
          {(hoverInfo.photo.camera || hoverInfo.photo.film) && (
            <p className="text-[11px] font-medium text-white/90">
              {hoverInfo.photo.camera || hoverInfo.photo.film}
            </p>
          )}
          <div className="flex gap-2 text-[10px] text-white/50">
            {hoverInfo.photo.focalLength && <span>{hoverInfo.photo.focalLength}</span>}
            {hoverInfo.photo.aperture && <span>{hoverInfo.photo.aperture}</span>}
            {hoverInfo.photo.shutter && <span>{hoverInfo.photo.shutter}</span>}
            {hoverInfo.photo.iso && <span>{hoverInfo.photo.iso}</span>}
          </div>
          {(hoverInfo.photo.date || hoverInfo.photo.location) && (
            <p className="mt-0.5 text-[10px] text-white/40">
              {[hoverInfo.photo.date, hoverInfo.photo.location].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Mobile ─────────────────────────────────────────────
function MobileGallery({ photos, onPhotoClick }: { photos: Photo[]; onPhotoClick: (p: Photo) => void }) {
  const [tapped, setTapped] = useState<number | null>(null);

  return (
    <div className="grid min-h-screen grid-cols-2 gap-0.5 bg-black pb-20">
      {[...photos, ...photos].map((photo, i) => {
        const showInfo = tapped === i;
        const hasInfo = photo.camera || photo.film || photo.focalLength || photo.date;
        return (
          <div
            key={`${photo.src}-${i}`}
            className="relative cursor-pointer overflow-hidden"
            style={{ height: photo.width > photo.height ? 140 : 200 }}
            onClick={() => {
              if (showInfo) { onPhotoClick(photo); setTapped(null); }
              else if (hasInfo) setTapped(i);
              else onPhotoClick(photo);
            }}
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
            {showInfo && (
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5">
                <div className="flex flex-col gap-0.5 text-[10px] text-white/80">
                  {(photo.camera || photo.film) && <span className="font-medium">{photo.camera || photo.film}</span>}
                  <span className="text-white/50">
                    {[photo.focalLength, photo.aperture, photo.shutter, photo.iso].filter(Boolean).join(" · ")}
                  </span>
                  {photo.date && <span className="text-white/40">{photo.date}</span>}
                </div>
                <p className="mt-1 text-[9px] text-white/30">tap again to view</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main export ────────────────────────────────────────
export default function PhotoGallery() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const filteredPhotos = useMemo(() => {
    const filtered = photosData.filter((p) => {
      if (filter === "digital") return !p.film;
      if (filter === "film") return !!p.film;
      return true;
    });
    if (shuffleSeed === 0) return filtered;
    // Shuffle with seed
    const arr = [...filtered];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (i * (shuffleSeed * 7 + 13) + shuffleSeed) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [filter, shuffleSeed]);

  const openLightbox = useCallback((photo: Photo) => {
    setLightboxIndex(photosData.indexOf(photo));
    setLightboxOpen(true);
  }, []);

  const filters: [FilterType, string][] = [
    ["all", "All"],
    ["digital", "Ricoh GR3x"],
    ["film", "Negative Film"],
  ];

  return (
    <div className="relative">
      <div className="pointer-events-auto fixed left-6 top-6 z-50 md:left-1/2 md:-translate-x-1/2">
        <div className="flex gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 shadow-2xl backdrop-blur-xl">
          {filters.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                filter === key ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
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
        <DomeWall photos={filteredPhotos} onPhotoClick={openLightbox} spinning={spinning} />
      )}

      {/* Shuffle dice — bottom right */}
      <button
        onPointerDown={() => setSpinning(true)}
        onPointerUp={() => { setSpinning(false); setShuffleSeed((s) => s + 1); }}
        onPointerLeave={() => { if (spinning) { setSpinning(false); setShuffleSeed((s) => s + 1); } }}
        className="pointer-events-auto fixed bottom-20 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-xl transition-all hover:bg-white/10 hover:scale-110"
        title="Shuffle"
      >
        <svg width="20" height="20" viewBox="0 0 512 512" fill="none" className="text-white/60">
          <path d="M255.76 44.764c-6.176 0-12.353 1.384-17.137 4.152L85.87 137.276c-9.57 5.536-9.57 14.29 0 19.826l152.753 88.36c9.57 5.536 24.703 5.536 34.272 0l152.753-88.36c9.57-5.535 9.57-14.29 0-19.825l-152.753-88.36c-4.785-2.77-10.96-4.153-17.135-4.153z" stroke="currentColor" strokeWidth="12" fill="none"/>
          <path d="M75.67 173.84c-5.753-.155-9.664 4.336-9.664 12.28v157.696c0 11.052 7.57 24.163 17.14 29.69l146.93 84.848c9.57 5.526 17.14 1.156 17.14-9.895V290.76c0-11.052-7.57-24.16-17.14-29.688l-146.93-84.847c-2.69-1.555-5.225-2.327-7.476-2.387z" stroke="currentColor" strokeWidth="12" fill="none"/>
          <path d="M436.443 173.842c-2.25.06-4.783.83-7.474 2.385l-146.935 84.847c-9.57 5.527-17.14 18.638-17.14 29.69v157.7c0 11.05 7.57 15.418 17.14 9.89L428.97 373.51c9.57-5.527 17.137-18.636 17.137-29.688v-157.7c0-7.942-3.91-12.432-9.664-12.278z" stroke="currentColor" strokeWidth="12" fill="none"/>
          <circle cx="180" cy="115" r="14" fill="currentColor"/><circle cx="260" cy="105" r="14" fill="currentColor"/><circle cx="340" cy="115" r="14" fill="currentColor"/>
          <circle cx="160" cy="280" r="14" fill="currentColor"/><circle cx="190" cy="350" r="14" fill="currentColor"/>
          <circle cx="350" cy="280" r="14" fill="currentColor"/><circle cx="320" cy="350" r="14" fill="currentColor"/>
        </svg>
      </button>

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
        styles={{
          container: { backgroundColor: "rgba(0,0,0,0.85)" },
          slide: { padding: "40px 80px" },
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  );
}
