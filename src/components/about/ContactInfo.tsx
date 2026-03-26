"use client";

import { Mail, Copy, Check } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import { useState } from "react";

const email = "jotp076315217@gmail.com";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/jotpalch",
    icon: GitHubIcon,
    username: "@jotpalch",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/wei-cheng-chen-366232226/",
    icon: LinkedInIcon,
    username: "Wei-Cheng Chen",
  },
];

export default function ContactInfo() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--border)] bg-cream-dark/50 p-5 dark:bg-warm-gray/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10">
            <Mail className="h-5 w-5 text-terracotta" />
          </div>
          <div className="flex-1">
            <p className="font-mono text-xs uppercase text-muted-brown">Email</p>
            <p className="text-sm text-charcoal dark:text-cream">{email}</p>
          </div>
          <button
            onClick={copyEmail}
            className="rounded-lg p-2 text-muted-brown transition-colors hover:text-terracotta"
            aria-label="Copy email"
          >
            {copied ? <Check className="h-4 w-4 text-sage" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-cream-dark/50 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-warm-gray/20"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10">
            <link.icon className="h-5 w-5 text-terracotta" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase text-muted-brown">{link.label}</p>
            <p className="text-sm text-charcoal dark:text-cream">{link.username}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
