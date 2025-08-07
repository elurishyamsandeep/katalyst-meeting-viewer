/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optional: Also ignore TypeScript errors during build if needed
    // ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
