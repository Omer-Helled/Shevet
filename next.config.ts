import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
    // Cache visited pages client-side so switching between tabs is instant.
    staleTimes: { dynamic: 30, static: 180 },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dcdxwswjicxpowbjwvxt.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
