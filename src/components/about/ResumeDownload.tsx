import { FileText, Download } from "lucide-react";

export default function ResumeDownload() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-cream-dark/50 p-6 dark:bg-warm-gray/20">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta/10">
          <FileText className="h-6 w-6 text-terracotta" />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-lg font-semibold italic text-charcoal dark:text-cream">
            Resume
          </h3>
          <p className="mt-1 text-sm text-muted-brown">
            Download my latest resume for a detailed overview of my skills and experience.
          </p>
          <a
            href="/resume/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-terracotta dark:bg-cream dark:text-warm-black dark:hover:bg-terracotta dark:hover:text-cream"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}
