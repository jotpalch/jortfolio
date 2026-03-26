"use client";

import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";
import { projectsData } from "@/data/projects";
import AnimatedSection from "@/components/ui/AnimatedSection";

const featured = projectsData.filter((p) => p.featured);

export default function FeaturedProjects() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <AnimatedSection>
          <p className="mb-6 font-mono text-[10px] uppercase tracking-widest text-white/30">
            Featured Projects
          </p>
        </AnimatedSection>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <AnimatedSection key={project.id} delay={i * 0.1}>
              <div className="glass-panel group flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10px] text-white/25">{project.year}</span>
                </div>

                <h3 className="font-serif text-base font-semibold italic text-white/90 transition-colors group-hover:text-white">
                  {project.title}
                </h3>

                {project.achievement && (
                  <p className="mt-1 text-[10px] font-medium text-terracotta/80">
                    {project.achievement}
                  </p>
                )}

                <p className="mt-3 flex-1 text-xs leading-relaxed text-white/35">
                  {project.description.slice(0, 120)}...
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/8 px-2 py-0.5 font-mono text-[10px] text-white/40"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex gap-3 border-t border-white/5 pt-3">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/30 transition-colors hover:text-white/70"
                    >
                      <GitHubIcon className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/30 transition-colors hover:text-white/70"
                    >
                      <Globe className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div className="mt-8 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-medium text-white/50 backdrop-blur transition-all hover:text-white/90"
            >
              All Projects <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
