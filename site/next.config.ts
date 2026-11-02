import type { NextConfig } from "next";

/**
 * GitHub Pages build: set by .github/workflows/pages.yml.
 * Exports plain static files into out/ and serves them under the repo path
 * (https://suhascpaunikar.github.io/soskillerportfolio/).
 */
const pagesBasePath = process.env.PAGES_BASE_PATH;
const isPagesBuild = pagesBasePath !== undefined;

const nextConfig: NextConfig = {
  // Static export can't use partial prerendering, so these stay off in the Pages build.
  cacheComponents: !isPagesBuild,
  partialPrefetching: !isPagesBuild,
  ...(isPagesBuild && {
    output: "export",
    basePath: pagesBasePath,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
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
