import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Increase serverActions body size limit for large file uploads
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
