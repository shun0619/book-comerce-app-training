import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
    ],
  },
  env: {
    API_KEY: process.env.NEXT_PUBLIC_API_KEY!,
  },
  reactStrictMode: false,
};

export default nextConfig;
