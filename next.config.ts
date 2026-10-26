import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Note: `next build` type-checks and lints by default and fails on errors,
  // so a broken content contract or type error can never reach a live call.
};

export default nextConfig;
