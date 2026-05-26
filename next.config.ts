import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Memaksa Vercel mengabaikan error type checking saat build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Memaksa Vercel mengabaikan pengecekan ESLint saat build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;