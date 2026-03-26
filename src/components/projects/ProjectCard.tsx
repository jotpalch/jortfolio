import { Globe, Newspaper } from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";
import { Project } from "@/types";
import TechBadge from "@/components/ui/TechBadge";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-cream-dark/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-warm-gray/20">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-serif text-lg font-semibold italic text-charcoal dark:text-cream">
          {project.title}
        </h3>
        <span className="ml-2 flex-shrink-0 font-mono text-xs text-muted-brown">
          {project.year}
        </span>
      </div>

      {/* Achievement badge */}
      {project.achievement && (
        <div className="mb-3">
          <span className="inline-flex items-center rounded-full bg-film-yellow/20 px-3 py-1 text-xs font-medium text-warm-gray dark:text-film-yellow">
            {project.achievement}
          </span>
        </div>
      )}

      {/* Description */}
      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-brown">
        {project.description}
      </p>

      {/* Tech stack */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <TechBadge key={tech} name={tech} />
        ))}
      </div>

      {/* Links */}
      <div className="flex items-center gap-4 border-t border-[var(--border)] pt-4">
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-brown transition-colors hover:text-terracotta"
          >
            <GitHubIcon className="h-4 w-4" />
            Code
          </a>
        )}
        {project.links.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-brown transition-colors hover:text-terracotta"
          >
            <Globe className="h-4 w-4" />
            Demo
          </a>
        )}
        {project.links.news && (
          <a
            href={project.links.news}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-brown transition-colors hover:text-terracotta"
          >
            <Newspaper className="h-4 w-4" />
            News
          </a>
        )}
      </div>
    </div>
  );
}
