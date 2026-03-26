"use client";

import { Trophy } from "lucide-react";
import { awardsData } from "@/data/awards";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function AwardsCTA() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Awards */}
        <AnimatedSection>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/30">
            Recognition
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {awardsData.map((award) => (
              <div
                key={award.title}
                className="glass-panel flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-5 sm:py-3"
              >
                <Trophy className="h-3.5 w-3.5 text-terracotta/60" />
                <div>
                  <p className="text-xs font-medium text-white/70">{award.title}</p>
                  <p className="text-[10px] text-white/30">
                    {award.organization} &middot; {award.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={0.2}>
          <div className="mt-16 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/20">
              Interested?
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold italic text-white/90 sm:text-4xl">
              Let&apos;s build something great
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="mailto:jotp076315217@gmail.com"
                className="rounded-full border border-white/10 bg-white/5 px-7 py-2.5 text-xs font-medium text-white/70 backdrop-blur transition-all hover:bg-white/10 hover:text-white"
              >
                Say Hello
              </a>
              <a
                href="/resume/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-7 py-2.5 text-xs font-medium text-white/70 backdrop-blur transition-all hover:bg-white/10 hover:text-white"
              >
                Resume
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
