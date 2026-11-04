import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/catalog/redirects";

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects();
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
