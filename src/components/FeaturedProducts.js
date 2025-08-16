"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function FeaturedProducts({ products = [] }) {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our carefully curated selection of premium jewelry pieces
          </p>
        </div>

        {/* Product Grid with Images */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col group">
                <div className="relative w-full h-56 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                  <img
                    src={product.images?.[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-primary-600 font-bold text-xl mb-2">₹{product.price}</p>
                <span className="text-primary-600 font-medium hover:underline mt-auto">View Details</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No products found</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-full hover:bg-primary-700 shadow-lg font-semibold"
          >
            View All Products
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
