'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const FeaturedCategories = ({ categories = [] }) => {
  // Fallback static categories for development/error cases
  const fallbackCategories = [
    {
      id: 1,
      name: 'Chains',
      slug: 'chains',
      description: 'Elegant gold and silver chains for every occasion',
      image: '/category-chains.jpg',
      _count: { products: 1 }
    },
    {
      id: 2,
      name: 'Earrings',
      slug: 'earrings',
      description: 'Beautiful earrings from traditional to contemporary',
      image: '/category-earrings.jpg',
      _count: { products: 1 }
    },
    {
      id: 3,
      name: 'Bangles',
      slug: 'bangles',
      description: 'Traditional and modern bangles in various styles',
      image: '/category-bangles.jpg',
      _count: { products: 1 }
    },
    {
      id: 4,
      name: 'Rings',
      slug: 'rings',
      description: 'Stunning rings for engagements, weddings, and fashion',
      image: '/category-rings.jpg',
      _count: { products: 1 }
    },
    {
      id: 5,
      name: 'Necklaces',
      slug: 'necklaces',
      description: 'Exquisite necklaces from chokers to long sets',
      image: '/category-necklaces.jpg',
      _count: { products: 1 }
    },
    {
      id: 6,
      name: 'Bracelets',
      slug: 'bracelets',
      description: 'Delicate and bold bracelets for every style',
      image: '/category-bracelets.jpg',
      _count: { products: 1 }
    }
  ]

  const displayCategories = categories?.length > 0 ? categories : fallbackCategories

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">
            Shop by Category
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCategories.slice(0, 6).map((category) => (
            <Link
              href={`/categories/${category.slug}`}
              key={category.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="relative h-80 bg-gray-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority={category.id <= 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-serif font-bold mb-2 group-hover:text-primary-300 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-200 text-sm mb-3 line-clamp-2">
                        {category.description}
                      </p>
                      <span className="text-primary-300 text-sm font-medium">
                        {category._count?.products || 0} Products
                      </span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-primary-300 transform transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/10 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
          >
            View All Categories
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCategories
