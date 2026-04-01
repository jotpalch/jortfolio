"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "jotpac", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Photos", href: "/photography" },
  { label: "Articles", href: "/articles" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2" aria-label="Main navigation">
      <div className="flex items-center gap-0.5 rounded-full border border-white/10 bg-black/50 px-1.5 py-1 shadow-2xl backdrop-blur-xl sm:gap-1 sm:px-2 sm:py-1.5">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const isLogo = link.href === "/";
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-2.5 text-[11px] font-medium transition-all sm:px-4 sm:text-xs ${
                isLogo ? "font-serif italic " : ""
              }${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:text-white/90"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
