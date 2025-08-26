import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // productionBrowserSourceMaps: true,
  experimental: {
    // 启用更多调试信息
    // instrumentationHook: true
  }
};

export default nextConfig;
