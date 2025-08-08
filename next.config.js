/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    SITE_URL: process.env.NODE_ENV === 'production' ? 'https://orafashionz.com' : 'http://localhost:3000',
  },
  // Performance optimizations
  swcMinify: true, // Faster minification
  experimental: {
    optimizeCss: true, // Faster CSS processing
  },
  // Reduce build output
  output: 'standalone',
}

module.exports = nextConfig
