import type { NextConfig } from "next";
import os from "node:os";

const nextConfig: NextConfig = {
  turbopack: {
    // Point above both the worktree and the pnpm content store so Turbopack
    // finds `next/package.json` without walking into dot-directories like
    // `.claude/worktrees/` which it otherwise skips during auto-inference.
    root: os.homedir(),
  },
};

export default nextConfig;
