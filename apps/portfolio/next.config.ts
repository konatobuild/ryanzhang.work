import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next.js does not walk up to `/Users/reyn/package-lock.json`.
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;
