import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import EducationTimeline from "@/components/education/EducationTimeline";

export const metadata: Metadata = {
  title: "Education",
  description:
    "Wei-Cheng Chen's academic background in Computer Science at NYCU and NCTU.",
};

export default function EducationPage() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-brown">
            Academic journey
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold italic text-charcoal dark:text-cream sm:text-5xl">
            Education
          </h1>
          <div className="mt-3 h-0.5 w-12 bg-terracotta" />
        </div>
        <EducationTimeline />
      </Container>
    </section>
  );
}
