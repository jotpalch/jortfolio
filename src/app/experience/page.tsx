import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Wei-Cheng Chen's professional experience at Intel, ASML, and Realtek.",
};

export default function ExperiencePage() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-brown">
            Professional path
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold italic text-charcoal dark:text-cream sm:text-5xl">
            Work Experience
          </h1>
          <div className="mt-3 h-0.5 w-12 bg-terracotta" />
        </div>
        <ExperienceTimeline />
      </Container>
    </section>
  );
}
