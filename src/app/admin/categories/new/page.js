'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import {
  ChevronLeft,
  Save,
  Upload,
  X,
  Plus,
  Tags,
  FileText,
  Image as ImageIcon,
  Globe,
  Hash
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

export default function AddCategory() {
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image: '',
    isActive: true,
    metaTitle: '',
    metaDescription: ''
  })
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, isAdmin])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setFormData(prev => ({
        ...prev,
        slug: slug
      }))
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real implementation, you would upload this to a storage service
      // For now, we'll just create an object URL for preview
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      setFormData(prev => ({
        ...prev,
        image: imageUrl // In reality, this would be the uploaded image URL
      }))
    }
  }

  const removeImage = () => {
    setImagePreview('')
    setFormData(prev => ({
      ...prev,
      image: ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    if (!formData.slug.trim()) {
      toast.error('Category slug is required')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // This ensures cookies are sent with the request
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Category created successfully!')
        router.push('/admin/categories')
      } else {
        const error = await response.json()
        console.error('API Error:', error)
        toast.error(error.message || 'Failed to create category')
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          toast.error('Session expired. Please login again.')
          router.push('/login')
        }
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
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
        <div className="flex items-center mb-8">
          <Link
            href="/admin/categories"
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mr-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Categories
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center">
              <Plus className="w-8 h-8 mr-3 text-primary-600" />
              Add New Category
            </h1>
            <p className="text-gray-600">Create a new jewelry category</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Tags className="w-6 h-6 mr-2 text-primary-600" />
                  Basic Information
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter category name"
                    />
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
                        /categories/
                      </span>
                      <input
                        type="text"
                        id="slug"
                        name="slug"
                        required
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="category-slug"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      URL-friendly version of the name. This will be auto-generated from the category name.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe this category..."
                    />
                  </div>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-primary-600" />
                  SEO Settings
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      id="metaTitle"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="SEO title for search engines"
                      maxLength={60}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {formData.metaTitle.length}/60 characters. Leave empty to use category name.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      id="metaDescription"
                      name="metaDescription"
                      rows={3}
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="SEO description for search engines"
                      maxLength={160}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {formData.metaDescription.length}/160 characters. This appears in search results.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish Settings</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active Category</span>
                  </label>
                  <p className="text-sm text-gray-500">
                    Inactive categories won&apos;t be visible to customers
                  </p>
                </div>
              </div>

              {/* Category Image */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Category Image
                </h3>
                
                <div className="space-y-4">
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageUpload"
                      />
                      <label htmlFor="imageUpload" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-700 mb-2">Upload Category Image</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Category preview"
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <p className="text-sm text-gray-500">
                    This image will be displayed on the category page and in category listings.
                    Recommended size: 400x400 pixels.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Create Category
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
