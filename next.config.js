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
    SITE_URL: process.env.NODE_ENV === 'production' ? 'https://orafashionz.com' : 'http://localhost:3002',
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Generate sitemaps and improve SEO
  trailingSlash: false,
  // Compress responses
  compress: true,
  // Reduce build output
  output: 'standalone',
}

module.exports = nextConfig
