import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice recorder — mobile transcription prototype",
  description:
    "A three-state voice recorder: Start, Recording, and Editing. Golos Text display with a signal-red accent on a warm stage. Original indie concept, mobile-first.",
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
          href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
