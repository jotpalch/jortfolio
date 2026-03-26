import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ContactInfo from "@/components/about/ContactInfo";
import ResumeDownload from "@/components/about/ResumeDownload";
import EducationTimeline from "@/components/education/EducationTimeline";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PageTransition from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Wei-Cheng Chen — engineer, photographer, and builder of useful things.",
};

export default function AboutPage() {
  return (
    <PageTransition>
      <section className="py-12 sm:py-20">
        <Container>
          {/* Header */}
          <div className="mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-brown">
              The person behind the work
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold italic text-charcoal dark:text-cream sm:text-5xl">
              About Me
            </h1>
            <div className="mt-3 h-0.5 w-12 bg-terracotta" />
          </div>

          {/* Bio + Contact */}
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
            <AnimatedSection>
              <div className="space-y-5 text-base leading-relaxed text-muted-brown">
                <p>
                  Hi! I&apos;m <strong className="text-charcoal dark:text-cream">Wei-Cheng Chen</strong>,
                  a software engineer and film photography enthusiast based in Taipei, Taiwan.
                </p>
                <p>
                  Currently a System Software Engineer at{" "}
                  <strong className="text-charcoal dark:text-cream">NVIDIA</strong>. M.S. in CS from{" "}
                  <strong className="text-charcoal dark:text-cream">NYCU</strong>.
                </p>
                <p>
                  My work spans AI/ML, full-stack development, and systems engineering. I&apos;ve
                  Previously interned at <strong className="text-charcoal dark:text-cream">Intel</strong>,{" "}
                  <strong className="text-charcoal dark:text-cream">ASML</strong>, and{" "}
                  <strong className="text-charcoal dark:text-cream">Realtek</strong>. Won hackathons
                  and built everything from poker AI to blockchain apps.
                </p>
                <p>
                  Outside of code, I shoot <strong className="text-charcoal dark:text-cream">negative film</strong> and
                  a <strong className="text-charcoal dark:text-cream">Ricoh GR3x HDF</strong>. There&apos;s
                  something about the grain, the warmth, and the patience of analog that keeps me coming back.
                </p>
                <p>
                  I believe in delivering smiles &mdash; through useful software and honest photographs.
                </p>
              </div>
            </AnimatedSection>

            <div className="space-y-8">
              <AnimatedSection delay={0.1}>
                <h3 className="mb-4 font-serif text-lg font-semibold italic text-charcoal dark:text-cream">
                  Get in Touch
                </h3>
                <ContactInfo />
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <ResumeDownload />
              </AnimatedSection>
            </div>
          </div>

          {/* Experience */}
          <div className="mt-16 sm:mt-24">
            <AnimatedSection>
              <div className="mb-12">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-brown">
                  Professional path
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold italic text-charcoal dark:text-cream">
                  Work Experience
                </h2>
                <div className="mt-3 h-0.5 w-12 bg-terracotta" />
              </div>
            </AnimatedSection>
            <ExperienceTimeline />
          </div>

          {/* Education */}
          <div className="mt-16 sm:mt-24">
            <AnimatedSection>
              <div className="mb-12">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-brown">
                  Academic journey
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold italic text-charcoal dark:text-cream">
                  Education
                </h2>
                <div className="mt-3 h-0.5 w-12 bg-terracotta" />
              </div>
            </AnimatedSection>
            <EducationTimeline />
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}
