import type { NextConfig } from "next";

const BACKEND_URL = "https://odoo-x-ksv-hackathon.onrender.com";

const nextConfig: NextConfig = {
  turbopack: {
    root: "..",
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
