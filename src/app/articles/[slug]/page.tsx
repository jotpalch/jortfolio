import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Container from "@/components/ui/Container";
import ReadingProgress from "@/components/articles/ReadingProgress";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.meta.title,
    description: article.meta.summary,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <ReadingProgress />
      <section className="py-12 sm:py-20">
        <Container className="max-w-3xl">
          <Link
            href="/articles"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-brown transition-colors hover:text-terracotta"
          >
            <ArrowLeft className="h-4 w-4" />
            All articles
          </Link>

          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-3">
              <time className="font-mono text-xs text-muted-brown">
                {article.meta.date}
              </time>
              <span className="text-muted-brown/30">&middot;</span>
              <span className="flex items-center gap-1 font-mono text-xs text-muted-brown">
                <Clock className="h-3 w-3" />
                {article.meta.readingTime} min read
              </span>
              <span className="text-muted-brown/30">&middot;</span>
              <div className="flex flex-wrap gap-2">
                {article.meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="whitespace-nowrap rounded-full border border-[var(--border)] px-2 py-0.5 font-mono text-xs text-muted-brown"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="mt-6 font-serif text-3xl font-bold italic leading-tight text-charcoal dark:text-cream sm:text-4xl lg:text-5xl">
              {article.meta.title}
            </h1>
            {article.meta.summary && (
              <p className="mt-4 text-base leading-relaxed text-muted-brown sm:text-lg">
                {article.meta.summary}
              </p>
            )}
            <div className="mt-8 h-px bg-[var(--border)]" />
          </header>

          <article className="prose-article">
            <MDXRemote source={article.content} />
          </article>

          {/* End of article */}
          <div className="mt-16 border-t border-[var(--border)] pb-24 pt-8">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-sm font-medium text-terracotta hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all articles
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
