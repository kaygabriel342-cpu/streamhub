import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import PWAProvider from "@/components/PWAProvider";

export const metadata: Metadata = {
  title: "StreamHub - Watch Movies & TV Shows Online",
  description: "Stream movies, TV shows, anime, and live channels from multiple providers in a PWA experience.",
  keywords: "streaming, movies, TV shows, anime, live TV, online streaming",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StreamHub",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#e50914" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="StreamHub" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-[#141414] text-white antialiased">
        <PWAProvider>{children}</PWAProvider>
      </body>
    </html>
  );
}
