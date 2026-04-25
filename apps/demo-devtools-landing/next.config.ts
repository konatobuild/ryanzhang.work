import type { NextConfig } from "next";
import os from "node:os";

const nextConfig: NextConfig = {
  turbopack: {
    root: os.homedir(),
  },
};

export default nextConfig;
