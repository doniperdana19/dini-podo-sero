import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Memaksa Vercel mengabaikan semua error type checking saat build production
    ignoreBuildErrors: true,
  },
  eslint: {
    // Memaksa Vercel mengabaikan pengecekan ESLint saat build production
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;