import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      "/": [
        "./prisma/*.db",
        "./prisma/migrations/**/*",
      ],
    },
  },
};

export default nextConfig;
