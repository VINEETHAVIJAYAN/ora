'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, Grid, List } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function CategoryClient({ category, initialProducts, initialTotal }) {
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(initialTotal)
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotal / 12))

  useEffect(() => {
    if (searchQuery || sortBy !== 'createdAt' || sortOrder !== 'desc' || currentPage !== 1) {
      fetchProducts()
    }
  }, [searchQuery, sortBy, sortOrder, currentPage])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        categoryId: category.id,
        ...(searchQuery && { search: searchQuery }),
        sortBy,
        sortOrder
      })

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setTotalProducts(data.total)
        setTotalPages(Math.ceil(data.total / 12))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
      </div>

      {/* Category Hero Image */}
      {category.image && (
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* Search and Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search in ${category.name}...`}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSortChange('name')}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  sortBy === 'name' 
                    ? 'bg-primary-600 text-white border-primary-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSortChange('price')}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  sortBy === 'price' 
                    ? 'bg-primary-600 text-white border-primary-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
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
      </div>

      {/* Products Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {loading ? 'Loading...' : `Showing ${products.length} of ${totalProducts} products`}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `No products found for "${searchQuery}" in ${category.name}`
              : `No products available in ${category.name} category at the moment.`
            }
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex">
                    <div className="w-48 h-48 relative">
                      <Image
                        src={product.images?.[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {product.name}
                        </h3>
                        <div className="text-right">
                          {product.salePrice ? (
                            <div>
                              <span className="text-lg font-bold text-primary-600">
                                ₹{product.salePrice.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ₹{product.price.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              ₹{product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      {product.description && (
                        <p className="text-gray-700 mb-4 line-clamp-2">{product.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                          {product.stockQuantity > 0 ? (
                            <span className="text-sm text-green-600">In Stock ({product.stockQuantity})</span>
                          ) : (
                            <span className="text-sm text-red-600">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-lg ${
                      currentPage === page
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
