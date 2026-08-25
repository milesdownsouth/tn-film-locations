import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Increase serverActions body size limit for large file uploads (up to 200 images)
    // Images are auto-compressed to ~2MB each on client side
    serverActions: {
      bodySizeLimit: '300mb',
    },
  },
};

export default nextConfig;
