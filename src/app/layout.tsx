import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import PWAProvider from "@/components/PWAProvider";

const siteUrl = "https://marqueeflix.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Marqueeflix - Stream Movies, TV Shows, Anime and Live TV",
    template: "%s | Marqueeflix",
  },
  description: "Watch movies, TV shows, anime, and live TV channels on Marqueeflix. Browse providers, anime catalogs, trending titles, and live channels in a fast installable PWA.",
  keywords: [
    "Marqueeflix",
    "free streaming app",
    "watch movies online",
    "watch TV shows online",
    "anime streaming",
    "live TV streaming",
    "movie providers",
    "PWA streaming app",
    "Netflix alternative",
    "Prime Video alternative",
    "Dulo alternative",
  ],
  applicationName: "Marqueeflix",
  authors: [{ name: "Marqueeflix" }],
  creator: "Marqueeflix",
  publisher: "Marqueeflix",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Marqueeflix",
    title: "Marqueeflix - Stream Movies, TV Shows, Anime and Live TV",
    description: "Browse movies, TV shows, anime, providers and live TV channels in one fast PWA.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marqueeflix - Stream Movies, TV Shows, Anime and Live TV",
    description: "Browse movies, TV shows, anime, providers and live TV channels in one fast PWA.",
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
    title: "Marqueeflix",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Marqueeflix",
    url: siteUrl,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Web, Android, iOS, Windows, macOS, Linux, Smart TV",
    description: "Marqueeflix is a PWA for browsing movies, TV shows, anime, providers, and live TV channels.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Movie and TV browsing",
      "Anime catalog browsing",
      "Live HLS TV player",
      "Provider-based discovery",
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
        <meta name="apple-mobile-web-app-title" content="Marqueeflix" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#141414] text-white antialiased">
        <PWAProvider>{children}</PWAProvider>
      </body>
    </html>
  );
}
