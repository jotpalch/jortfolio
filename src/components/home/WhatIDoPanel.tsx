"use client";

import Image from "next/image";
import { skillsData } from "@/data/skills";
import AnimatedSection from "@/components/ui/AnimatedSection";

const companies = [
  { name: "NVIDIA", src: "/images/companies/nv.png" },
  { name: "Intel", src: "/images/companies/intc.png" },
  { name: "ASML", src: "/images/companies/asml.png" },
  { name: "Realtek", src: "/images/companies/realtek.png" },
];

export default function WhatIDoPanel() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <AnimatedSection>
          <div className="glass-panel p-8 sm:p-10">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
              Where I&apos;ve Worked
            </p>

            {/* Company logos */}
            <div className="mt-6 grid grid-cols-2 items-center gap-6 sm:flex sm:gap-10">
              {companies.map((c) => (
                <Image
                  key={c.name}
                  src={c.src}
                  alt={c.name}
                  width={200}
                  height={60}
                  className="h-5 w-auto brightness-0 invert opacity-40 transition-opacity hover:opacity-80 sm:h-6"
                />
              ))}
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-white/5" />

            {/* Skills grouped by category */}
            <p className="mb-5 font-mono text-[10px] uppercase tracking-widest text-white/30">
              Technologies
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {skillsData.map((cat) => (
                <div key={cat.name}>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/25">
                    {cat.name}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/8 px-2.5 py-0.5 text-[11px] text-white/50 transition-colors hover:border-white/20 hover:text-white/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
