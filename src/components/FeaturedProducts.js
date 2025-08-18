"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function FeaturedProducts({ products = [] }) {
  return (
    <section className="py-6 px-4 bg-gray-50">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-4 text-center">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-2">
            Featured Products
          </h2>
        </div>

        {/* Product Grid with Images */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <Link
                  href={`/products/${product.slug}`}
                  key={product.id}
                  className="bg-white p-3 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col group"
                >
                  <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center mb-3">
                    <img
                      src={product.images?.[0] || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                    {product.stockQuantity === 0 && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                        Out of stock
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-4 mb-1">
                    {product.salePrice && product.salePrice < product.price ? (
                      <>
                        <span className="text-gray-500 line-through text-lg">
                          ₹{product.price.toFixed(2)}
                        </span>
                        <span className="text-green-600 font-bold text-lg">
                          ₹{product.salePrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-800 font-bold text-lg">
                        ₹{product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="text-primary-600 font-medium hover:underline mt-auto">
                    View Details
                  </span>
                </Link>
              ))}
            </div>
            <div className="flex justify-end mt-2">
              <Link
                href="/products"
                className="text-primary-600 font-medium hover:underline text-base"
              >
                Explore all
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts
