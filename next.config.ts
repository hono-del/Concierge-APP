import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/": [
      "./prisma/*.db",
      "./prisma/migrations/**/*",
    ],
  },
};

export default nextConfig;
