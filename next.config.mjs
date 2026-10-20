/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://staticflow.onrender.com",
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "https://staticflow.onrender.com";
    return [
      { source: "/api/backend/:path*", destination: `${backendUrl}/api/v1/:path*` },
    ];
  },
};
export default nextConfig;
