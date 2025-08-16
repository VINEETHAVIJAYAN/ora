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
  Package,
  Tag,
  DollarSign,
  Hash,
  FileText,
  Image as ImageIcon,
  Globe
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

export default function AddProduct() {
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    salePrice: '',
    sku: '',
    categoryId: '',
    stockQuantity: '',
    weight: '',
    material: '',
    dimensions: '',
    images: [],
    tags: [],
    isActive: true,
    isFeatured: false,
    metaTitle: '',
    metaDescription: ''
  })
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login')
      return
    }
    
    fetchCategories()
  }, [isAuthenticated, isAdmin])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories', {
        credentials: 'include' // Ensure cookies are sent
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      } else {
        console.error('Failed to fetch categories:', response.status)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    const uploadedUrls = [];

    for (const file of files) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'ora-ecommerce'); // You can change this to your actual preset

      const res = await fetch('https://api.cloudinary.com/v1_1/djpertvld/image/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (result.secure_url) {
        uploadedUrls.push(result.secure_url);
      } else {
        toast.error('Image upload failed');
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls]
    }));
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const generateSKU = () => {
    const category = categories.find(cat => cat.id === parseInt(formData.categoryId))
    const categoryCode = category ? category.name.substring(0, 3).toUpperCase() : 'PRD'
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `${categoryCode}-${randomNum}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.price || !formData.sku || !formData.categoryId) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Product created successfully!')
        router.push('/admin/products')
      } else {
        const error = await response.json()
        console.error('API Error:', error)
        toast.error(error.message || 'Failed to create product')
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          toast.error('Session expired. Please login again.')
          router.push('/login')
        }
      }
    } catch (error) {
      console.error('Error creating product:', error)
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
            href="/admin/products"
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mr-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Products
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center">
              <Plus className="w-8 h-8 mr-3 text-primary-600" />
              Add New Product
            </h1>
            <p className="text-gray-600">Create a new jewelry product for your store</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Package className="w-6 h-6 mr-2 text-primary-600" />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="sku"
                        name="sku"
                        required
                        value={formData.sku}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter SKU"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, sku: generateSKU() }))}
                        className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
                        title="Generate SKU"
                      >
                        <Hash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      required
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
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
                      placeholder="Describe your product..."
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <DollarSign className="w-6 h-6 mr-2 text-primary-600" />
                  Pricing & Inventory
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Regular Price * (₹)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price (₹)
                    </label>
                    <input
                      type="number"
                      id="salePrice"
                      name="salePrice"
                      min="0"
                      step="0.01"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      id="stockQuantity"
                      name="stockQuantity"
                      min="0"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-primary-600" />
                  Product Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (grams)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      min="0"
                      step="0.01"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-2">
                      Material
                    </label>
                    <input
                      type="text"
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Gold, Silver, Diamond"
                    />
                  </div>

                  <div>
                    <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      id="dimensions"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 2cm x 1.5cm"
                    />
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-primary-600" />
                  SEO Settings
                </h2>
                
                <div className="space-y-4">
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
                    />
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
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                  </label>
                </div>
              </div>

              {/* Product Images */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Product Images
                </h3>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload images</p>
                    </label>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`Product image ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-primary-600" />
                  Tags
                </h3>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                    >
                      Add
                    </button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-gray-500 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
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
                      Create Product
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
