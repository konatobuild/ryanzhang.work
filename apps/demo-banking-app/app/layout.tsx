import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Volt — fintech mobile prototype",
  description:
    "Volt is a digital banking concept — Home, Cards, and Analytics screens shown side-by-side as an iOS triptych. Lime accent on warm white, Instrument Serif numerals, original branding.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
