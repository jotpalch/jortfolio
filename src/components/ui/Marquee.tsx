"use client";

interface MarqueeProps {
  text: string;
  className?: string;
}

export default function Marquee({ text, className = "" }: MarqueeProps) {
  const repeated = `${text} \u00B7 `.repeat(10);
  return (
    <div className={`overflow-hidden border-y border-[var(--border)] py-4 ${className}`}>
      <div className="animate-marquee whitespace-nowrap">
        <span className="font-serif text-2xl italic text-muted-brown/60 sm:text-3xl">
          {repeated}
        </span>
        <span className="font-serif text-2xl italic text-muted-brown/60 sm:text-3xl">
          {repeated}
        </span>
      </div>
    </div>
  );
}
