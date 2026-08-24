import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/": [
      "./prisma/*.db",
      "./prisma/migrations/**/*",
    ],
  },
  experimental: {
    // localStorageと同期する動的ページ（Dashboard等）で、クライアントサイド
    // ナビゲーション後に古いRSCペイロードが表示され続けるのを防ぐ
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
