/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    // typedRoutes: true,
    fontLoaders: [
      { loader: 'next/font/google', options: { subsets: ['latin'] } },
    ],
    serverComponentsExternalPackages: ['prisma'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.thegazelle.org',
        port: '',
        pathname: '/gazelle/2023/**',
      },
      {
        protocol: 'http',
        hostname: '0.gravatar.com',
        port: '',
        pathname: '/avatar/**',
      },
    ],
    domains: [
      'cdn.thegazelle.org',
      'gravatar.com',
    ],
  },
}

module.exports = nextConfig
