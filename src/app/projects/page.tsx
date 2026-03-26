import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ProjectListWithPreview from "@/components/projects/ProjectListWithPreview";
import PageTransition from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore Wei-Cheng Chen's projects spanning AI/ML, web development, blockchain, and automation.",
};

export default function ProjectsPage() {
  return (
    <PageTransition>
      <section className="py-20">
        <Container>
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-brown">
              Things I&apos;ve built
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold italic text-charcoal dark:text-cream sm:text-5xl">
              All Projects
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-brown">
              {`${15}`} projects across AI/ML, web, blockchain, automation, and data visualization.
              Hover for details.
            </p>
            <div className="mt-3 h-0.5 w-12 bg-terracotta" />
          </div>
          <ProjectListWithPreview />
        </Container>
      </section>
    </PageTransition>
  );
}
