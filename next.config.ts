import type { NextConfig } from "next";

const repo = "project-document-management";

const isProduction = process.env.NODE_ENV === "production";

// const nextConfig: NextConfig = {
//   basePath: isProduction ? `/${repo}` : '',
//   assetPrefix: isProduction ? `/${repo}` : '',
//   // basePath: '/project-document-management',
//   // assetPrefix: '/project-document-management/',
//   trailingSlash: true,
//   images: {
//     unoptimized: true
//   }

// };

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "",
  assetPrefix: "",
};

export default nextConfig;

