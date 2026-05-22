import type { NextConfig } from "next";
import os from "node:os";

// industrial.ryanzhang.work serves the /industrial-design page as its root.
// One Next.js app, one Vercel deployment — the host header remaps the URL
// invisibly so the address bar stays on the subdomain. ryanzhang.work/
// industrial-design is collapsed into a 308 to keep one canonical URL.
const INDUSTRIAL_HOST = "industrial.ryanzhang.work";

const nextConfig: NextConfig = {
  turbopack: {
    // Point above both the worktree and the pnpm content store so Turbopack
    // finds `next/package.json` without walking into dot-directories like
    // `.claude/worktrees/` which it otherwise skips during auto-inference.
    root: os.homedir(),
  },
  // Next.js 16 requires quality values be allowlisted. Default is [75] only —
  // any other quality prop silently falls back to 75. Enable higher tiers
  // for hero and case-study photography.
  images: {
    qualities: [75, 90, 100],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: INDUSTRIAL_HOST }],
          destination: "/industrial-design",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    return [
      // Canonicalize the industrial deck to the subdomain. Any inbound link
      // to ryanzhang.work/industrial-design (hamburger nav, About page,
      // footer) lands on industrial.ryanzhang.work instead.
      {
        source: "/industrial-design",
        has: [{ type: "host", value: "ryanzhang.work" }],
        destination: "https://industrial.ryanzhang.work/",
        permanent: true,
      },
      {
        source: "/industrial-design",
        has: [{ type: "host", value: "www.ryanzhang.work" }],
        destination: "https://industrial.ryanzhang.work/",
        permanent: true,
      },
      // Subdomain is one page only. Any non-root path on the industrial
      // host bounces to the main domain so /about etc. don't accidentally
      // render under industrial.ryanzhang.work.
      {
        source: "/:path+",
        has: [{ type: "host", value: INDUSTRIAL_HOST }],
        destination: "https://ryanzhang.work/:path+",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
