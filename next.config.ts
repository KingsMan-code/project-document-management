import type { NextConfig } from "next";

const repo = "project-document-management";

const nextConfig: NextConfig = {
  output: "export",
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  routerType: "hash",
};

export default nextConfig;
