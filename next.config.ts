import type { NextConfig } from "next";

// STATIC_EXPORT=1 -> build website statis untuk GitHub Pages (tanpa server; AI coach offline).
const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = isStatic
  ? { output: "export", basePath, trailingSlash: true }
  : {};

export default nextConfig;
