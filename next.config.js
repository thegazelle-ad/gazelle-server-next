/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
 },
  images: {
    loader: 'custom',
    loaderFile: './image-loader.tsx',
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
      {
        protocol: 'https',
        hostname: 'i6.cims.nyu.edu',
        port: '',
        pathname: '/',
      }
    ],
    domains: [
      'cdn.thegazelle.org',
      'gravatar.com',
      'i6.cims.nyu.edu',
    ],
  },
}

module.exports = nextConfig
