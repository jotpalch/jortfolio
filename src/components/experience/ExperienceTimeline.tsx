"use client";

import Image from "next/image";
import { experienceData } from "@/data/experience";
import TechBadge from "@/components/ui/TechBadge";
import AnimatedSection from "@/components/ui/AnimatedSection";

const companyLogos: Record<string, string> = {
  NVIDIA: "/images/companies/nv.png",
  Intel: "/images/companies/intc.png",
  ASML: "/images/companies/asml.png",
  Realtek: "/images/companies/realtek.png",
};

export default function ExperienceTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-[1.75rem] top-0 -z-10 hidden h-full w-px bg-white/5 md:block" />

      <div className="space-y-12">
        {experienceData.map((exp, i) => (
          <AnimatedSection key={exp.id} delay={i * 0.15}>
            <div className="relative flex gap-6 md:gap-10">
              {/* Timeline dot with company logo */}
              <div className="relative z-10 hidden md:block">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-white/8 bg-white/5 p-2.5">
                  {companyLogos[exp.company] ? (
                    <Image
                      src={companyLogos[exp.company]}
                      alt={exp.company}
                      fill
                      className="object-contain p-2.5 brightness-0 invert opacity-60"
                      sizes="56px"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white/40">{exp.company[0]}</span>
                  )}
                </div>
              </div>

              {/* Card */}
              <div className="glass-panel flex-1 p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {/* Mobile logo */}
                    {companyLogos[exp.company] && (
                      <div className="relative h-5 w-12 flex-shrink-0 md:hidden">
                        <Image
                          src={companyLogos[exp.company]}
                          alt=""
                          fill
                          className="object-contain brightness-0 invert opacity-50"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-white/90">
                        {exp.company}
                      </h3>
                      <p className="mt-0.5 text-sm text-white/50">{exp.role}</p>
                    </div>
                  </div>
                  <span className="flex-shrink-0 font-mono text-xs text-white/30">
                    {exp.startDate}&ndash;{exp.endDate ?? "Present"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-white/30">{exp.location}</p>
                <ul className="mt-4 space-y-2">
                  {exp.description.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm text-white/45"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/20" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exp.techStack.map((tech) => (
                    <TechBadge key={tech} name={tech} />
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
