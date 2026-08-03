/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [],
    unoptimized: false,
  },
  webpack: (config, { isServer }) => {
    // غیرفعال کردن کش Webpack برای جلوگیری از خطای Out of Memory در محیط‌های ابری/استک‌بلیتز
    config.cache = false;
    // کاهش همزمانی فایل‌خوانی برای جلوگیری از خطای EAGAIN
    config.snapshot = {
      ...(config.snapshot || {}),
      managedPaths: [],
      immutablePaths: [],
    };
    // غیرفعال‌سازی watch در محیط build
    config.watchOptions = { ignored: /node_modules/, aggregateTimeout: 0, poll: false };
    // محدود کردن parallelism برای کاهش فشار filesystem
    config.parallelism = 1;
    return config;
  },
};

export default nextConfig;