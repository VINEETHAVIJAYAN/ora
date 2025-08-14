import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://orafashionz.com'

export async function GET() {
  // Get all active products
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Get all active categories
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Product pages
  const productPages = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${BASE_URL}/categories/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Combine all pages
  const allPages = [...staticPages, ...productPages, ...categoryPages]

  // Convert to XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allPages
    .map(
      (page) => `  <url>\n    <loc>${page.url}</loc>\n    <lastmod>${
        page.lastModified.toISOString()
      }</lastmod>\n    <changefreq>${page.changeFrequency}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`
    )
    .join('\n')}\n</sitemapindex>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
