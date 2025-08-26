import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // productionBrowserSourceMaps: true,
  experimental: {
    // 启用更多调试信息
    // instrumentationHook: true
  },
  // 添加React编译器选项
  compiler: {
    // 抑制React 19相关的警告
    reactRemoveProperties: false,
  },
  // 添加webpack配置来抑制特定警告
  webpack: (config, { isServer }) => {
    // 抑制React ref相关的警告
    config.ignoreWarnings = [
      /Accessing element\.ref was removed in React 19/,
      /ref is now a regular prop/,
    ];
    return config;
  },
};

export default nextConfig;
