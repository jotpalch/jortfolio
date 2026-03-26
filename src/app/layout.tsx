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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <main>{children}</main>
          <Navbar />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
