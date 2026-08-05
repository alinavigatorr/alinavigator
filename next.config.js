/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // 🛑 [REMOVED FOR PRODUCTION]: 
  // eslint: { ignoreDuringBuilds: true }
  // typescript: { ignoreBuildErrors: true }
  // از این پس بیلد پروژه در صورت وجود خطا متوقف خواهد شد (Strict Mode)

  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
  // افزودن هدرهای امنیتی پروداکشن به همراه حفظ کامل ساختار قبلی شما
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
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