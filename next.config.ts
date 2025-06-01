import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stable features (formerly experimental)
  bundlePagesRouterDependencies: true,
  serverExternalPackages: ['pg', 'bcrypt', '@prisma/client'],

  // Router cache configuration
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  // Webpack configuration to handle pg package issues
  webpack: (config, { isServer }) => {
    if (isServer) {
      // These modules should only be used on the server side
      config.externals.push('pg', 'bcrypt', '@prisma/client');
    } else {
      // For client-side builds, we need to ignore these problematic modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        util: false,
        buffer: false,
        querystring: false,
        url: false,
      };
      
      config.externals.push({
        'cloudflare:sockets': 'commonjs cloudflare:sockets',
      });
    }
    
    return config;
  },
};

export default nextConfig;
