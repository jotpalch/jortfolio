import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center py-20">
      <Container className="text-center">
        <h1 className="font-serif text-8xl font-bold italic text-terracotta">
          404
        </h1>
        <h2 className="mt-4 font-serif text-2xl italic text-charcoal dark:text-cream">
          Lost in the darkroom
        </h2>
        <p className="mt-3 text-muted-brown">
          This page doesn&apos;t exist. Maybe it was never developed.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-terracotta dark:bg-cream dark:text-warm-black dark:hover:bg-terracotta dark:hover:text-cream"
        >
          Go Home
        </Link>
      </Container>
    </section>
  );
}
