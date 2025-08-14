'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Search, Grid, List } from 'lucide-react'

export default function CategoriesClient({ initialCategories }) {
  const [categories] = useState(initialCategories)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Our Jewelry Categories
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore our complete collection of traditional and contemporary jewelry, 
          carefully organized by category to help you find the perfect piece.
        </p>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* View Mode */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid/List */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `No categories found matching "${searchQuery}"`
              : "No categories are currently available."
            }
          </p>
        </div>
      ) : (
        <>
          {/* Categories Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredCategories.length} of {categories.length} categories
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={category.image || '/placeholder-product.jpg'}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-400 transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-200 mb-3 opacity-90">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                          {category._count?.products || 0} Products
                        </span>
                        <div className="flex items-center text-sm group-hover:text-primary-400 transition-colors">
                          <span className="mr-2">Shop Now</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
                >
                  <div className="flex">
                    <div className="w-48 h-32 relative">
                      <Image
                        src={category.image || '/placeholder-product.jpg'}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-gray-600 mb-2">
                              {category.description}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            {category._count?.products || 0} products available
                          </p>
                        </div>
                        <div className="flex items-center text-primary-600 group-hover:text-primary-700 transition-colors">
                          <span className="mr-2">Shop Now</span>
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* CTA Section */}
      <div className="text-center mt-16 bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
          Can't Find What You're Looking For?
        </h2>
        <p className="text-gray-600 mb-6">
          Browse all our products or get in touch with our experts for personalized recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            View All Products
            <ArrowRight size={20} className="ml-2" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
