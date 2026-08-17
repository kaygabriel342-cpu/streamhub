import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import PWAProvider from "@/components/PWAProvider";

const siteUrl = "https://marqueeflix.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Marquee - Watch Movies, TV Shows and Anime",
    template: "%s | Marquee",
  },
  description: "Browse movies, TV shows, and anime in a compact streaming interface with TMDB metadata and VidKing playback.",
  keywords: [
    "Marquee",
    "movies online",
    "TV shows online",
    "anime catalog",
    "VidKing player",
    "TMDB streaming metadata",
    "PWA streaming app",
  ],
  applicationName: "Marquee",
  authors: [{ name: "Marquee" }],
  creator: "Marquee",
  publisher: "Marquee",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Marquee",
    title: "Marquee - Watch Movies, TV Shows and Anime",
    description: "Browse movies, TV shows, and anime with VidKing playback in one fast PWA.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marquee - Watch Movies, TV Shows and Anime",
    description: "Browse movies, TV shows, and anime with VidKing playback in one fast PWA.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Marquee",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Marquee",
    url: siteUrl,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Web, Android, iOS, Windows, macOS, Linux, Smart TV",
    description: "Marquee is a PWA for browsing movies, TV shows, and anime with VidKing playback.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Movie and TV browsing",
      "Anime catalog browsing",
      "VidKing iframe playback",
      "Installable PWA",
      "Responsive TV and mobile interface",
    ],
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#e50914" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Marquee" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#050507] text-white antialiased">
        <PWAProvider>{children}</PWAProvider>
      </body>
    </html>
  );
}
