import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ryanzhang.work"),
  title: {
    default: "Ryan Zhang — Design Engineer",
    template: "%s — Ryan Zhang",
  },
  description:
    "Design Engineer shipping UX end-to-end — interface, interaction, and front-end in one pair of hands.",
  openGraph: {
    type: "website",
    url: "https://ryanzhang.work",
    title: "Ryan Zhang — Design Engineer",
    description:
      "Design Engineer shipping UX end-to-end — interface, interaction, and front-end in one pair of hands.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="preload"
          href="/fonts/inter-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
