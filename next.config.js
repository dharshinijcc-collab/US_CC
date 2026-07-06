/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
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
}

module.exports = nextConfig