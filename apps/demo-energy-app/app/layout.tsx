import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sunhold — home energy monitor",
  description:
    "Sunhold is an original home energy monitoring concept: solar production, battery reserve, and grid activity on a single iOS surface. Warm yellow palette, peak-load chart with sun-beam tail, floating glass tab bar. Prototype by ryanzhang.work.",
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
