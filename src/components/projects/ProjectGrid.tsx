"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsData } from "@/data/projects";
import { ProjectCategory } from "@/types";
import ProjectFilter from "./ProjectFilter";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid() {
  const [activeCategory, setActiveCategory] = useState<
    ProjectCategory | "All"
  >("All");

  const filteredProjects =
    activeCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.categories.includes(activeCategory));

  return (
    <div>
      <ProjectFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <motion.div
        layout
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filteredProjects.length === 0 && (
        <p className="mt-10 text-center text-slate-500 dark:text-slate-400">
          No projects found in this category.
        </p>
      )}
    </div>
  );
}
