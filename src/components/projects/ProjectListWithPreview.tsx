"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsData } from "@/data/projects";
import { Project, ProjectCategory } from "@/types";
import ProjectFilter from "./ProjectFilter";
import TechBadge from "@/components/ui/TechBadge";
import { GitHubIcon } from "@/components/ui/Icons";
import { Globe, Newspaper, ArrowUpRight } from "lucide-react";

// Color map for categories
const categoryColors: Record<string, string> = {
  "AI/ML": "bg-terracotta/60",
  Web: "bg-sage/60",
  Blockchain: "bg-film-yellow/60",
  Automation: "bg-blush/60",
  "Data Visualization": "bg-muted-brown/40",
};

export default function ProjectListWithPreview() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "All">("All");
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProjects =
    activeCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.categories.includes(activeCategory));

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, []);

  return (
    <div>
      <ProjectFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <div
        ref={containerRef}
        className="relative"
        onMouseMove={handleMouseMove}
      >
        {/* Cursor-following preview dot (desktop only) */}
        <AnimatePresence>
          {hoveredProject && (
            <motion.div
              className="pointer-events-none absolute z-10 hidden lg:block"
              style={{ left: mousePos.x + 20, top: mousePos.y - 30 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-xl border border-[var(--border)] bg-cream p-4 shadow-xl dark:bg-warm-black">
                <p className="max-w-xs text-xs leading-relaxed text-muted-brown">
                  {hoveredProject.description.slice(0, 120)}...
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {hoveredProject.techStack.slice(0, 4).map((t) => (
                    <span key={t} className="font-mono text-[10px] text-terracotta">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project list */}
        <div className="divide-y divide-[var(--border)]">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="group"
                onMouseEnter={() => setHoveredProject(project)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="flex items-center gap-4 py-5 transition-all duration-200 group-hover:pl-3">
                  {/* Category color dot */}
                  <span
                    className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${categoryColors[project.categories[0]] ?? "bg-muted-brown/30"}`}
                  />

                  {/* Title + year */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3">
                      <h3 className="truncate font-serif text-lg font-semibold italic text-charcoal transition-colors group-hover:text-terracotta dark:text-cream dark:group-hover:text-terracotta">
                        {project.title}
                      </h3>
                      <span className="flex-shrink-0 font-mono text-xs text-muted-brown">
                        {project.year}
                      </span>
                    </div>
                    {/* Achievement */}
                    {project.achievement && (
                      <p className="mt-0.5 text-xs font-medium text-film-yellow">
                        {project.achievement}
                      </p>
                    )}
                    {/* Tech badges — visible on mobile, hidden on desktop where preview shows them */}
                    <div className="mt-2 flex flex-wrap gap-1.5 lg:hidden">
                      {project.techStack.map((tech) => (
                        <TechBadge key={tech} name={tech} />
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex flex-shrink-0 items-center gap-3">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-brown transition-colors hover:text-terracotta"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GitHubIcon className="h-4 w-4" />
                      </a>
                    )}
                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-brown transition-colors hover:text-terracotta"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                    {project.links.news && (
                      <a
                        href={project.links.news}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-brown transition-colors hover:text-terracotta"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Newspaper className="h-4 w-4" />
                      </a>
                    )}
                    <ArrowUpRight className="h-4 w-4 text-muted-brown/0 transition-all group-hover:text-terracotta" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <p className="py-12 text-center text-muted-brown">No projects in this category.</p>
        )}
      </div>
    </div>
  );
}
