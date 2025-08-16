import CategoriesClient from './CategoriesClient'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'

// Enable ISR - revalidate every 2 hours
export const revalidate = 7200

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Dynamic metadata for SEO
export async function generateMetadata() {
  const categories = await getCategories()
  const categoryNames = categories.map(cat => cat.name).join(', ')

  return {
    title: 'Jewelry Categories - Traditional & Contemporary Collections | ORA Fashions',
    description: `Explore our complete jewelry categories including ${categoryNames.slice(0, 100)}... Shop traditional and contemporary jewelry at ORA Fashions.`,
    keywords: `jewelry categories, ${categoryNames}, traditional jewelry, contemporary jewelry, handcrafted jewelry, ORA Fashions`,
    openGraph: {
      title: 'Jewelry Categories - ORA Fashions',
      description: 'Discover our beautiful jewelry categories - from traditional to contemporary designs',
      url: '/categories',
      images: [
        {
          url: '/logo.jpeg',
          width: 1200,
          height: 630,
          alt: 'ORA Fashions Jewelry Categories',
        }
      ],
    },
    alternates: {
      canonical: '/categories',
    },
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoriesClient initialCategories={categories} />
      <Footer />
    </div>
  )
}
