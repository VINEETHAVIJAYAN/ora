'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

export default function ProductsManagement() {
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login')
      return
    }
    
    fetchProducts()
    fetchCategories()
  }, [isAuthenticated, isAdmin, currentPage, searchTerm, selectedCategory, sortBy, sortOrder])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { categoryId: selectedCategory }),
        sortBy,
        sortOrder
      })

      const response = await fetch(`/api/admin/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
        setTotalPages(data.totalPages)
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Product deleted successfully')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/admin"
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mr-4"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center">
                <Package className="w-8 h-8 mr-3 text-primary-600" />
                Products Management
              </h1>
              <p className="text-gray-600">Manage your jewelry inventory</p>
            </div>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </form>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order)
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory ? 'Try adjusting your filters' : 'Get started by adding your first product'}
              </p>
              <Link
                href="/admin/products/new"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Product
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-600">Product</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-600">Category</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-600">Price</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-600">Stock</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{product.category?.name}</td>
                        <td className="py-4 px-6">
                          <div className="text-gray-900 font-medium">
                            ₹{product.price.toLocaleString('en-IN')}
                          </div>
                          {product.salePrice && (
                            <div className="text-sm text-green-600">
                              Sale: ₹{product.salePrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.stockQuantity > 10 
                              ? 'bg-green-100 text-green-800'
                              : product.stockQuantity > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stockQuantity} units
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.isActive 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="p-2 text-gray-500 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                              title="View Product"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
