import type { NextConfig } from "next";

const repo = "project-document-management";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

