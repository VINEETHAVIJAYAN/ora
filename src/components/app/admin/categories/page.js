'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import {
  Search,
  Plus,
  Tags,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

export default function CategoriesManagement() {
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login')
      return
    }
    
    fetchCategories()
  }, [isAuthenticated, isAdmin, currentPage, searchTerm])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/admin/categories?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
        setTotalPages(data.totalPages)
      } else {
        toast.error('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchCategories()
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category? All products in this category will need to be reassigned.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Category deleted successfully')
        fetchCategories()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
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
                <Tags className="w-8 h-8 mr-3 text-primary-600" />
                Categories Management
              </h1>
              <p className="text-gray-600">Organize your jewelry products by categories</p>
            </div>
          </div>
          <Link
            href="/admin/categories/new"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Category
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading categories...</p>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20">
              <Tags className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first category'}
              </p>
              <Link
                href="/admin/categories/new"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Category
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {categories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    {/* Category Image */}
                    <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={200}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Tags className="w-12 h-12 text-gray-400" />
                      )}
                    </div>

                    {/* Category Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">/{category.slug}</p>
                      </div>

                      {category.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{category.description}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center text-sm text-gray-500">
                            <Package className="w-4 h-4 mr-1" />
                            {category._count.products} products
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            category.isActive 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/categories/${category.id}/edit`}
                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                            title="Edit Category"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
