"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Camera, Code, Trophy, MapPin, Pen, Clock } from "lucide-react";
import { skillsData } from "@/data/skills";

function BentoCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" as const }}
      className={`rounded-2xl border border-[var(--border)] bg-cream-dark/50 p-6 transition-all duration-300 hover:shadow-lg dark:bg-warm-gray/20 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function LocalClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Taipei",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);
  return <span>{time || "--:--"}</span>;
}

export default function BentoGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto]">
        {/* About card — spans 2 cols, 2 rows */}
        <BentoCard className="sm:col-span-2 lg:row-span-2" delay={0}>
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10">
                <Code className="h-5 w-5 text-terracotta" />
              </div>
              <h3 className="font-serif text-2xl font-bold italic text-charcoal dark:text-cream">
                Engineer by day
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-brown">
                System Software Engineer at NVIDIA.
                M.S. in CS from NYCU. Previously at Intel, ASML, and Realtek.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-6 inline-flex text-sm font-medium text-terracotta hover:underline"
            >
              More about me &rarr;
            </Link>
          </div>
        </BentoCard>

        {/* Photography card */}
        <BentoCard className="lg:row-span-2" delay={0.1}>
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sage/20">
                <Camera className="h-5 w-5 text-sage" />
              </div>
              <h3 className="font-serif text-xl font-bold italic text-charcoal dark:text-cream">
                Photographer by heart
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-brown">
                Shooting negative film and Ricoh GR3x HDF.
                Capturing light, grain, and quiet moments.
              </p>
            </div>
            <Link
              href="/photography"
              className="mt-6 inline-flex text-sm font-medium text-terracotta hover:underline"
            >
              View gallery &rarr;
            </Link>
          </div>
        </BentoCard>

        {/* Awards card */}
        <BentoCard delay={0.2}>
          <div className="flex h-full flex-col">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-film-yellow/30">
              <Trophy className="h-5 w-5 text-film-yellow" />
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-brown">Awards</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium text-charcoal dark:text-cream">Meichu Hackathon 1st</p>
              <p className="text-sm font-medium text-charcoal dark:text-cream">LINE FRESH Top 6</p>
              <p className="text-sm font-medium text-charcoal dark:text-cream">CTCI Scholarship</p>
            </div>
          </div>
        </BentoCard>

        {/* Skills tags — spans 2 cols */}
        <BentoCard className="sm:col-span-2" delay={0.15}>
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-brown">
            Tech I work with
          </p>
          <div className="flex flex-wrap gap-2">
            {skillsData.flatMap((cat) => cat.skills).map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-charcoal transition-colors hover:border-terracotta hover:text-terracotta dark:text-cream-dark dark:hover:text-terracotta"
              >
                {skill}
              </span>
            ))}
          </div>
        </BentoCard>

        {/* Articles card */}
        <BentoCard delay={0.2}>
          <Link href="/articles" className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blush/20">
                <Pen className="h-5 w-5 text-blush" />
              </div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-brown">Writing</p>
              <p className="mt-1 text-sm text-charcoal dark:text-cream">
                Thoughts on engineering, photography &amp; everything between
              </p>
            </div>
            <span className="mt-4 text-sm font-medium text-terracotta">
              Read articles &rarr;
            </span>
          </Link>
        </BentoCard>

        {/* Location + time card */}
        <BentoCard delay={0.25}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/10">
              <MapPin className="h-5 w-5 text-sage" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-brown">Based in</p>
              <p className="text-sm font-medium text-charcoal dark:text-cream">Taipei, Taiwan</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-film-yellow/20">
              <Clock className="h-5 w-5 text-film-yellow" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-brown">Local time</p>
              <p className="font-mono text-sm font-medium text-charcoal dark:text-cream">
                <LocalClock /> TST
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Status card */}
        <BentoCard delay={0.3}>
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-sage" />
            </span>
            <p className="text-sm text-muted-brown">
              Working at <span className="font-medium text-charcoal dark:text-cream">NVIDIA</span>
            </p>
          </div>
        </BentoCard>
      </div>
    </section>
  );
}
