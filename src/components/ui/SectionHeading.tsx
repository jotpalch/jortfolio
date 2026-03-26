interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${className}`}>
      {subtitle && (
        <p className="font-mono text-xs uppercase tracking-widest text-muted-brown">
          {subtitle}
        </p>
      )}
      <h2 className="mt-2 font-serif text-3xl font-bold italic text-charcoal dark:text-cream sm:text-4xl">
        {title}
      </h2>
      <div className="mt-3 h-0.5 w-12 bg-terracotta" />
    </div>
  );
}
