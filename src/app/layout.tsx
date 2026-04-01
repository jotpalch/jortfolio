import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/layout/Navbar";
import BackToTop from "@/components/ui/BackToTop";
import "./globals.css";

const GA_ID = "G-XWRBBC6J2D";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jotpac.com"),
  title: {
    default: "Wei-Cheng Chen — Engineer & Photographer",
    template: "%s | Wei-Cheng Chen",
  },
  description:
    "Portfolio of Wei-Cheng Chen — Software Engineer, AI/ML enthusiast, and film photography lover.",
  openGraph: {
    title: "Wei-Cheng Chen — Engineer & Photographer",
    description:
      "System Software Engineer at NVIDIA. Film photography & Ricoh GR3x HDF.",
    url: "https://www.jotpac.com",
    siteName: "Wei-Cheng Chen",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Wei-Cheng Chen — Engineer & Photographer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wei-Cheng Chen — Engineer & Photographer",
    description: "System Software Engineer at NVIDIA. Film photography & Ricoh GR3x HDF.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  other: {
    "color-scheme": "dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} overflow-x-hidden`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Wei-Cheng Chen",
              url: "https://www.jotpac.com",
              jobTitle: "System Software Engineer",
              worksFor: { "@type": "Organization", name: "NVIDIA" },
              sameAs: [
                "https://github.com/jotpalch",
                "https://www.linkedin.com/in/jotpalch",
              ],
            }),
          }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body className="film-grain min-h-screen overflow-x-hidden bg-[var(--bg)] font-sans text-[var(--text-primary)] antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-black/90 focus:px-4 focus:py-2 focus:text-white focus:outline-none">
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <main id="main">{children}</main>
          <Navbar />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
