import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse Fitness — iOS prototype",
  description:
    "Train with intention. Readiness score, weekly load, resting HR — a fitness tracker iOS prototype.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
