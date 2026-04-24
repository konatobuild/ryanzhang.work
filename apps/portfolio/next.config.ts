import type { NextConfig } from "next";
import os from "node:os";

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
};

export default nextConfig;
