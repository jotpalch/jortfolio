import { ExternalLink as ExternalLinkIcon } from "lucide-react";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export default function ExternalLink({
  href,
  children,
  className = "",
  showIcon = true,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 ${className}`}
    >
      {children}
      {showIcon && <ExternalLinkIcon className="h-3.5 w-3.5" />}
    </a>
  );
}
