interface TechBadgeProps {
  name: string;
}

export default function TechBadge({ name }: TechBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] px-2.5 py-0.5 font-mono text-xs text-muted-brown">
      {name}
    </span>
  );
}
