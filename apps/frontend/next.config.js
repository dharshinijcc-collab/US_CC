const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  outputFileTracingRoot: path.join(__dirname, '../../'),
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/founder',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: true,
      },
      {
        source: '/admin/config.yml',
        destination: '/admin/login',
        permanent: true,
      },
      {
        source: '/config.yml',
        destination: '/admin/login',
        permanent: true,
      },
      {
        source: '/admin/index.html',
        destination: '/admin/login',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
}

module.exports = nextConfig