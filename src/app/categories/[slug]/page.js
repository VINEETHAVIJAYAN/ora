import CategoryClient from './CategoryClient'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

// Enable ISR - revalidate every hour
export const revalidate = 3600

async function getCategoryWithProducts(slug) {
  try {
    // Find category by slug
    const category = await prisma.category.findUnique({
      where: { 
        slug: slug,
        isActive: true 
      }
    })
    
    if (!category) {
      return null
    }

    // Get products for this category
    const products = await prisma.product.findMany({
      where: {
        categoryId: category.id,
        isActive: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 12
    })

    const totalProducts = await prisma.product.count({
      where: {
        categoryId: category.id,
        isActive: true
      }
    })

    return {
      category,
      products,
      total: totalProducts
    }
  } catch (error) {
    console.error('Error fetching category and products:', error)
    return null
  }
}

// Generate static params for all categories
export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true }
    })

    return categories.map((category) => ({
      slug: category.slug,
    }))
  } catch (error) {
    return []
  }
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const data = await getCategoryWithProducts(params.slug)

  if (!data) {
    return {
      title: 'Category Not Found - ORA Fashions',
    }
  }

  const { category } = data

  return {
    title: `${category.name} - Traditional Jewelry Collection | ORA Fashions`,
    description: category.description || `Shop beautiful ${category.name.toLowerCase()} from our traditional jewelry collection. Handcrafted with premium quality materials at ORA Fashions.`,
    keywords: `${category.name}, traditional ${category.name.toLowerCase()}, handcrafted jewelry, ${category.name.toLowerCase()} collection, ORA Fashions`,
    openGraph: {
      title: `${category.name} Collection - ORA Fashions`,
      description: category.description || `Beautiful ${category.name.toLowerCase()} collection`,
      url: `/categories/${category.slug}`,
      images: category.image ? [
        {
          url: category.image,
          width: 1200,
          height: 630,
          alt: category.name,
        }
      ] : [],
    },
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
  }
}

export default async function CategoryPage({ params }) {
  const data = await getCategoryWithProducts(params.slug)

  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryClient 
        category={data.category}
        initialProducts={data.products}
        initialTotal={data.total}
      />
      <Footer />
    </div>
  )
}
