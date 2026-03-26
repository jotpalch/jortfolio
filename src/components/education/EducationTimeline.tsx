"use client";

import { GraduationCap } from "lucide-react";
import { educationData } from "@/data/education";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function EducationTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-8 top-0 hidden h-full w-px bg-[var(--border)] md:block" />

      <div className="space-y-12">
        {educationData.map((edu, i) => (
          <AnimatedSection key={edu.id} delay={i * 0.15}>
            <div className="relative flex gap-6 md:gap-10">
              <div className="relative z-10 hidden md:block">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-4 border-cream bg-terracotta/10 dark:border-warm-black">
                  <GraduationCap className="h-6 w-6 text-terracotta" />
                </div>
              </div>
              <div className="flex-1 rounded-2xl border border-[var(--border)] bg-cream-dark/50 p-6 transition-shadow hover:shadow-md dark:bg-warm-gray/20">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-xl font-semibold italic text-charcoal dark:text-cream">
                      {edu.school}
                    </h3>
                    <p className="mt-1 text-base text-terracotta">
                      {edu.degree} in {edu.field}
                    </p>
                  </div>
                  <span className="flex-shrink-0 font-mono text-sm text-muted-brown">
                    {edu.startYear}&ndash;{edu.endYear}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-brown">{edu.location}</p>
                {edu.description && (
                  <ul className="mt-4 space-y-2">
                    {edu.description.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-muted-brown"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-terracotta" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
