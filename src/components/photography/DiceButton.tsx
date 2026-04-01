"use client";

import { useEffect, useRef } from "react";

// Generate dot texture for a dice face
function createDotTexture(dots: number, THREE: typeof import("three")): import("three").CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Transparent background with faint grey border
  ctx.clearRect(0, 0, size, size);
  const r = 16;
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(4, 4, size - 8, size - 8, r);
  ctx.stroke();

  // Dot positions for 1-6
  const positions: Record<number, [number, number][]> = {
    1: [[0.5, 0.5]],
    2: [[0.28, 0.28], [0.72, 0.72]],
    3: [[0.28, 0.28], [0.5, 0.5], [0.72, 0.72]],
    4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
    5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
    6: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.5], [0.72, 0.5], [0.28, 0.72], [0.72, 0.72]],
  };

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  const dotR = size * 0.065;
  for (const [x, y] of positions[dots]) {
    ctx.beginPath();
    ctx.arc(x * size, y * size, dotR, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Create rounded box geometry
function createRoundedBox(THREE: typeof import("three"), w: number, h: number, d: number, radius: number, segs: number) {
  const shape = new THREE.Shape();
  const hw = w / 2 - radius;
  const hh = h / 2 - radius;
  shape.moveTo(-hw, -h / 2);
  shape.lineTo(hw, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -hh);
  shape.lineTo(w / 2, hh);
  shape.quadraticCurveTo(w / 2, h / 2, hw, h / 2);
  shape.lineTo(-hw, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, hh);
  shape.lineTo(-w / 2, -hh);
  shape.quadraticCurveTo(-w / 2, -h / 2, -hw, -h / 2);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: d,
    bevelEnabled: true,
    bevelThickness: radius,
    bevelSize: radius,
    bevelSegments: segs,
  });
  geo.translate(0, 0, -d / 2);
  return geo;
}

interface DiceButtonProps {
  spinning: boolean;
  onDown: () => void;
  onUp: () => void;
  className?: string;
}

export default function DiceButton({ spinning, onDown, onUp, className }: DiceButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    cube: import("three").Mesh;
    renderer: import("three").WebGLRenderer;
    raf: number;
    velX: number;
    velY: number;
    velZ: number;
    spinTime: number;
  } | null>(null);
  const spinningRef = useRef(false);
  spinningRef.current = spinning;

  useEffect(() => {
    const el = containerRef.current?.querySelector(".dice-canvas") as HTMLDivElement | null;
    if (!el || stateRef.current) return;

    let cancelled = false;
    import("three").then((THREE) => {
      if (cancelled || !el) return;

      const scene = new THREE.Scene();
      const cam = new THREE.OrthographicCamera(-1.4, 1.4, 1.4, -1.4, 0.1, 10);
      cam.position.set(2, 2, 2);
      cam.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(36, 36);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      // Rounded cube
      const materials = [1, 6, 2, 5, 3, 4].map(
        (dots) => new THREE.MeshBasicMaterial({ map: createDotTexture(dots, THREE) })
      );
      const geo = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
      const cube = new THREE.Mesh(geo, materials);
      scene.add(cube);

      cube.rotation.x = 0.4;
      cube.rotation.y = 0.6;

      const state = { cube, renderer, raf: 0, velX: 0, velY: 0.005, velZ: 0, spinTime: 0 };

      const tick = () => {
        if (spinningRef.current) {
          // Acceleration: ramp up over time
          state.spinTime++;
          const ramp = Math.min(1, state.spinTime / 40); // takes ~40 frames to reach max
          const maxX = 0.05 + ramp * 0.15;
          const maxY = 0.04 + ramp * 0.12;
          const maxZ = 0.03 + ramp * 0.08;
          state.velX += (maxX - state.velX) * 0.08;
          state.velY += (maxY - state.velY) * 0.08;
          state.velZ += (maxZ - state.velZ) * 0.08;
        } else {
          state.spinTime = 0;
          state.velX *= 0.92;
          state.velY *= 0.95;
          state.velZ *= 0.92;
          if (Math.abs(state.velY) < 0.006) state.velY = 0.005;
        }

        cube.rotation.x += state.velX;
        cube.rotation.y += state.velY;
        cube.rotation.z += state.velZ;

        renderer.render(scene, cam);
        state.raf = requestAnimationFrame(tick);
      };
      state.raf = requestAnimationFrame(tick);
      stateRef.current = state;
    });

    return () => { cancelled = true; };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      onPointerDown={(e) => { e.preventDefault(); onDown(); }}
      onPointerUp={onUp}
      onPointerLeave={() => { if (spinningRef.current) onUp(); }}
      aria-label="Shuffle"
    >
      {/* Outer ring */}
      <div className="flex h-9 w-9 md:h-[42px] md:w-[42px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/40 backdrop-blur-xl transition-all hover:bg-white/10 hover:scale-110">
        <div className="dice-canvas" style={{ width: 36, height: 36 }} />
      </div>
    </div>
  );
}
