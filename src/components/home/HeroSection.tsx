"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function HeroSection() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Parallax on the photo
  const photoX = useTransform(springX, [0, 1], [12, -12]);
  const photoY = useTransform(springY, [0, 1], [8, -8]);

  // Subtle glow shift
  const glowX = useTransform(springX, [0, 1], [-20, 20]);
  const glowY = useTransform(springY, [0, 1], [-20, 20]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  return (
    <section className="relative flex min-h-screen items-center justify-center pb-20">
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Floating cutout profile photo — overlaps the name below */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" as const, delay: 0.7 }}
          style={{ x: photoX, y: photoY }}
          className="relative z-10 -mb-10 -ml-4 sm:-mb-14 sm:-ml-8"
        >
          {/* Ambient radial glow — locked behind the photo */}
          <motion.div
            className="pointer-events-none absolute inset-0 -inset-x-32 -inset-y-24 opacity-25 blur-[100px]"
            style={{
              background: "radial-gradient(circle, rgba(196,114,90,0.6) 0%, transparent 70%)",
              x: glowX,
              y: glowY,
            }}
          />
          <Image
            src="/images/profile.png"
            alt="Wei-Cheng Chen"
            width={843}
            height={833}
            className="relative h-56 w-auto sm:h-72 md:h-80 lg:h-96"
            style={{ maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" }}
            priority
          />
        </motion.div>

        {/* Text */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative z-20 flex flex-col items-center"
        >
          <motion.h1 variants={fadeUp} className="font-serif text-4xl font-bold italic text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] sm:text-5xl lg:text-7xl">
            Wei-Cheng Chen
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-white/50">
            Software Engineer &amp; Film Photographer
          </motion.p>
          <motion.p variants={fadeUp} className="mt-2 max-w-xs text-sm leading-relaxed text-white/30 sm:max-w-md">
            System Software Engineer at NVIDIA. Shooting negative film &amp; Ricoh GR3x HDF. Delivering smiles.
          </motion.p>

          {/* CTA capsules */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/projects"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-medium text-white/80 backdrop-blur transition-all hover:bg-white/10 hover:text-white"
            >
              Projects
            </Link>
            <Link
              href="/photography"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-medium text-white/80 backdrop-blur transition-all hover:bg-white/10 hover:text-white"
            >
              Photo Gallery
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-medium text-white/80 backdrop-blur transition-all hover:bg-white/10 hover:text-white"
            >
              About Me
            </Link>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
