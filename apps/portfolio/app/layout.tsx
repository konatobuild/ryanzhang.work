import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

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
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
