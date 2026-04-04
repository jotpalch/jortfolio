"use client";

import { ProjectCategory } from "@/types";

const categories: (ProjectCategory | "All")[] = [
  "All",
  "AI/ML",
  "Web",
  "Blockchain",
  "Automation",
  "Data Visualization",
];

interface ProjectFilterProps {
  activeCategory: ProjectCategory | "All";
  onCategoryChange: (category: ProjectCategory | "All") => void;
}

export default function ProjectFilter({
  activeCategory,
  onCategoryChange,
}: ProjectFilterProps) {
  return (
    <div className="mb-10 flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
            activeCategory === category
              ? "bg-charcoal text-cream dark:bg-cream dark:text-warm-black"
              : "border border-[var(--border)] text-muted-brown hover:border-terracotta hover:text-terracotta"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
