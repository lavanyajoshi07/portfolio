import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
    serverActions: {
      bodySizeLimit: '10mb',
      allowedOrigins: [
        '10.217.110.109', // your first IP
        '10.79.165.109',  // the one you’re currently using
        'localhost',      // always include localhost
      ],
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://widget.cloudinary.com; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
              "font-src 'self' https://fonts.gstatic.com; " +
              "img-src 'self' data: blob: https://res.cloudinary.com https://avatars.githubusercontent.com; " +
              "media-src 'self' blob: https://res.cloudinary.com; " +
              "connect-src 'self' https://api.anthropic.com https://api.github.com; " +
              "frame-src 'none'",
          },
        ],
      },
    ]
  },
  async rewrites() {
    return []
  },
}

export default nextConfig
