"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { photosData } from "@/data/photos";
import { optimizedSrc, getBlurDataURL } from "@/lib/photo-utils";

export default function FilmStrip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const photos = photosData.slice(0, 8);

  return (
    <section ref={ref} className="overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="glass-panel overflow-hidden p-6"
        >
          <div className="mb-4 flex items-end justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
              Recent Shots
            </p>
            <Link
              href="/photography"
              className="text-[11px] text-white/40 transition-colors hover:text-white/70"
            >
              View all &rarr;
            </Link>
          </div>

          <div
            className="flex max-w-full gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {photos.map((photo, i) => (
              <Link
                key={photo.src}
                href="/photography"
                className="group flex-shrink-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="relative overflow-hidden rounded-lg border border-white/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/15 group-hover:shadow-lg"
                >
                  <Image
                    src={optimizedSrc(photo.src, "sm")}
                    alt={photo.alt}
                    width={photo.width * 60}
                    height={photo.height * 60}
                    placeholder={getBlurDataURL(photo.src) ? "blur" : undefined}
                    blurDataURL={getBlurDataURL(photo.src)}
                    className="h-32 w-auto object-cover transition-transform duration-500 group-hover:scale-105 sm:h-40"
                  />
                </motion.div>
                <p className="mt-1.5 font-mono text-[9px] text-white/20">
                  {String(i + 1).padStart(2, "0")}A
                </p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
