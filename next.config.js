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
    // https://beta.nextjs.org/docs/api-reference/components/image#imagesizes
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 448, 512],
    deviceSizes: [448, 512, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
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
