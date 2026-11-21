import type { Metadata, Viewport } from "next";
import { Host_Grotesk } from "next/font/google";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import "./site.css";

const host = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
  display: "swap",
});

const DESCRIPTION =
  "Ryan Zhang designs objects to hold and software to use. Industrial design, interfaces and working prototypes, including the Red Dot-winning CoolDrip coffee maker.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ryanzhang.work"),
  title: {
    default: "Ryan Zhang — objects and software",
    template: "%s — Ryan Zhang",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: "https://ryanzhang.work",
    title: "Ryan Zhang — objects and software",
    description: DESCRIPTION,
    images: ["/work/cooldrip/hero.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1012" },
  ],
};

/* Applied before first paint so the stored theme never flashes. */
const THEME_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search).get("theme"),t=q||localStorage.getItem("theme");if(t!=="ink"&&t!=="paper"){t=matchMedia("(prefers-color-scheme: dark)").matches?"ink":"paper"}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={host.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
