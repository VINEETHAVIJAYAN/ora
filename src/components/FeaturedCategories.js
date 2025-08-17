'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const FeaturedCategories = ({ categories = [] }) => {
  // Only show first 4 categories from DB
  const displayCategories = categories?.slice(0, 4) || []

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-2">
            Shop by Category
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Categories Grid - show only 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayCategories.map((category) => (
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
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

        {/* Explore all link at right bottom */}
        <div className="flex justify-end mt-2">
          <Link
            href="/categories"
            className="text-primary-600 font-medium hover:underline text-base"
          >
            Explore all
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCategories
