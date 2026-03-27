import Link from "next/link";
import { Clock } from "lucide-react";
import { ArticleMeta } from "@/lib/articles";

interface ArticleCardProps {
  article: ArticleMeta;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <article className="rounded-2xl border border-[var(--border)] bg-cream-dark/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-warm-gray/20">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <time className="font-mono text-muted-brown">{article.date}</time>
          <span className="text-muted-brown/30">&middot;</span>
          <span className="flex items-center gap-1 font-mono text-muted-brown">
            <Clock className="h-3 w-3" />
            {article.readingTime} min
          </span>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="whitespace-nowrap rounded-full border border-[var(--border)] px-2 py-0.5 font-mono text-muted-brown"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <h3 className="mt-3 font-serif text-xl font-semibold italic text-charcoal transition-colors group-hover:text-terracotta dark:text-cream dark:group-hover:text-terracotta">
          {article.title}
        </h3>
        {article.summary && (
          <p className="mt-2 text-sm leading-relaxed text-muted-brown">
            {article.summary}
          </p>
        )}
        <span className="mt-4 inline-block text-sm font-medium text-terracotta">
          Read more &rarr;
        </span>
      </article>
    </Link>
  );
}
