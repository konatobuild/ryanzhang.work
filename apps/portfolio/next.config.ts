import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next.js does not walk up to `/Users/reyn/package-lock.json`.
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  // Next.js 16 requires quality values be allowlisted. Default is [75] only —
  // any other quality prop silently falls back to 75. Enable higher tiers
  // for hero and case-study photography.
  images: {
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
