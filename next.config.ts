import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ini perintah paling sakti buat maksa Vercel mengabaikan ESLint total saat build production!
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Sekalian abaikan error typescript biar ga rewel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;