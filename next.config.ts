import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compress: true,
  allowedDevOrigins: ['10.28.202.109', 'localhost'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion', 'date-fns'],
    serverActions: {
      bodySizeLimit: '10mb',
      allowedOrigins: [
        '10.28.202.109',
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
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
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
              "frame-src 'self'",
          },
        ],
      },
      {
        source: '/(favicon.png|favicon.ico|images/.*|videos/.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return []
  },
  async redirects() {
    return [
      {
        source: '/resume.pdf',
        destination: '/resume',
        permanent: false,
      },
      {
        source: '/about',
        destination: '/#about',
        permanent: true,
      },
      {
        source: '/techstack',
        destination: '/#skills',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/#projects',
        permanent: true,
      },
      {
        source: '/certificates',
        destination: '/#certifications',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/#contact',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
