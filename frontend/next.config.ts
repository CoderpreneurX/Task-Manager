import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tasks',
        permanent: true, // Set to `false` if you want a temporary redirect
      },
    ];
  },
};

export default nextConfig;
