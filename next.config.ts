import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "172.19.170.105",
    "192.168.1.7"
  ],
};

export default nextConfig;
