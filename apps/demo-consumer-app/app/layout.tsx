import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STRIDE — iOS fitness prototype",
  description:
    "Train like it counts. HR zones, weekly load, streaks, and personal bests — a sport-forward fitness tracker iOS prototype.",
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
