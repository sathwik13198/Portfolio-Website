
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // We allow the build to proceed even if there are legacy artifacts in the root
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
