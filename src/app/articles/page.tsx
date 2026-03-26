import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ArticleCard from "@/components/articles/ArticleCard";
import PageTransition from "@/components/ui/PageTransition";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Writings by Wei-Cheng Chen on engineering, AI/ML, film photography, and more.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <PageTransition>
      <section className="py-20">
        <Container>
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-brown">
              Thoughts &amp; learnings
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold italic text-charcoal dark:text-cream sm:text-5xl">
              Articles
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-brown">
              Writing about engineering, photography, and the things I learn along the way.
            </p>
            <div className="mt-3 h-0.5 w-12 bg-terracotta" />
          </div>

          {articles.length === 0 ? (
            <p className="text-muted-brown">No articles yet. Check back soon!</p>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </PageTransition>
  );
}
