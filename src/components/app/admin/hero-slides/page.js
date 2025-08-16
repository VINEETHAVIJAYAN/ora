'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown,
  Save,
  X,
  Upload
} from 'lucide-react'

export default function AdminHeroSlidesPage() {
  const { user } = useAuth()
  const [heroSlides, setHeroSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSlide, setEditingSlide] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    ctaText: '',
    ctaLink: '',
    isActive: true,
    order: 0
  })

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchHeroSlides()
    }
  }, [user])

  const fetchHeroSlides = async () => {
    try {
      const response = await fetch('/api/admin/hero-slides', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setHeroSlides(data.heroSlides || [])
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    try {
      const method = editingSlide ? 'PUT' : 'POST'
      const url = editingSlide 
        ? `/api/admin/hero-slides/${editingSlide.id}` 
        : '/api/admin/hero-slides'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowModal(false)
        setEditingSlide(null)
        setFormData({
          title: '',
          subtitle: '',
          description: '',
          image: '',
          ctaText: '',
          ctaLink: '',
          isActive: true,
          order: 0
        })
        fetchHeroSlides()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to save hero slide')
      }
    } catch (error) {
      console.error('Error saving hero slide:', error)
      alert('Failed to save hero slide')
    }
  }

  const handleEdit = (slide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      image: slide.image,
      ctaText: slide.ctaText,
      ctaLink: slide.ctaLink,
      isActive: slide.isActive,
      order: slide.order
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/hero-slides/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        fetchHeroSlides()
      } else {
        alert('Failed to delete hero slide')
      }
    } catch (error) {
      console.error('Error deleting hero slide:', error)
      alert('Failed to delete hero slide')
    }
  }

  const handleToggleActive = async (slide) => {
    try {
      const response = await fetch(`/api/admin/hero-slides/${slide.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...slide,
          isActive: !slide.isActive
        })
      })

      if (response.ok) {
        fetchHeroSlides()
      }
    } catch (error) {
      console.error('Error toggling slide status:', error)
    }
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You must be an admin to access this page.</p>
          <Link href="/admin" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hero Slides Management</h1>
            <p className="text-gray-600 mt-2">Manage banner images and content for the homepage</p>
          </div>
          <button
            onClick={() => {
              setEditingSlide(null)
              setFormData({
                title: '',
                subtitle: '',
                description: '',
                image: '',
                ctaText: '',
                ctaLink: '',
                isActive: true,
                order: 0
              })
              setShowModal(true)
            }}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Slide
          </button>
        </div>

        {/* Hero Slides List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {heroSlides.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Hero Slides</h3>
                <p className="text-gray-600 mb-4">Create your first hero slide to get started.</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
                >
                  Add New Slide
                </button>
              </div>
            ) : (
              heroSlides.map((slide) => (
                <div key={slide.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex">
                    {/* Image */}
                    <div className="w-64 h-40 relative">
                      <Image
                        src={slide.image || '/placeholder-product.jpg'}
                        alt={slide.title}
                        fill
                        className="object-cover"
                      />
                      {!slide.isActive && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold">Inactive</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{slide.title}</h3>
                          {slide.subtitle && (
                            <p className="text-primary-600 font-medium mb-2">{slide.subtitle}</p>
                          )}
                          {slide.description && (
                            <p className="text-gray-600 mb-2">{slide.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>CTA: {slide.ctaText}</span>
                            <span>→ {slide.ctaLink}</span>
                            <span>Order: {slide.order}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(slide)}
                            className={`p-2 rounded-lg ${
                              slide.isActive
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={slide.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {slide.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button
                            onClick={() => handleEdit(slide)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(slide.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter slide title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter subtitle (optional)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter slide description (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Image *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        if (!file) return
                        setFormData((prev) => ({ ...prev, image: '' }))
                        const data = new FormData();
                        data.append('file', file);
                        data.append('upload_preset', 'ora-ecommerce'); // Use your unsigned preset
                        try {
                          const res = await fetch('https://api.cloudinary.com/v1_1/djpertvld/image/upload', {
                            method: 'POST',
                            body: data,
                          });
                          const result = await res.json();
                          if (result.secure_url) {
                            setFormData((prev) => ({ ...prev, image: result.secure_url }));
                          } else {
                            alert('Image upload failed');
                          }
                        } catch (err) {
                          alert('Image upload failed');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <img src={formData.image} alt="Hero preview" className="w-full h-40 object-cover rounded-lg border" />
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended size: 1920x700px or similar aspect ratio
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CTA Button Text *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.ctaText}
                        onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Shop Now, Learn More, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CTA Link *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.ctaLink}
                        onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="/products, /categories/chains, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="0"
                        min="0"
                      />
                      <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full ${formData.isActive ? 'bg-primary-600' : 'bg-gray-300'} relative transition-colors`}>
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          Active (visible on website)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2"
                    >
                      <Save size={16} />
                      {editingSlide ? 'Update Slide' : 'Create Slide'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
