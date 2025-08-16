'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  Trash2,
  ShoppingCart,
  Star,
  Grid,
  List,
  Search
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'

export default function FavoritesPage() {
  const { isAuthenticated, user } = useAuth()
  const { addToCart } = useCart()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/favorites', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites)
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (productId, productName) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.productId !== productId))
        toast.success(`${productName} removed from favorites`)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to remove from favorites')
      }
    } catch (error) {
      toast.error('Failed to remove from favorites')
    }
  }

  const handleAddToCart = async (product) => {
    try {
      const result = await addToCart(product.id)
      if (result.success) {
        toast.success(`${product.name} added to cart!`)
      } else {
        toast.error(result.error || 'Failed to add to cart')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const filteredFavorites = favorites.filter(favorite =>
    favorite.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    favorite.product?.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Login Required
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Please log in to view your favorite items and create your personal wishlist.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              Login to View Favorites
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/products"
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Continue Shopping
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center">
                <Heart className="w-8 h-8 mr-3 text-red-500 fill-current" />
                My Favorites
              </h1>
              <p className="text-gray-600">
                {favorites.length} {favorites.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
            </div>
          </div>
        </div>

        {favorites.length === 0 ? (
          /* Empty Favorites */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring our jewelry collection and save your favorite pieces here for easy access later.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            {/* Search and View Controls */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search favorites..."
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

            {/* Results count */}
            {searchQuery && (
              <div className="mb-6">
                <p className="text-gray-600">
                  {filteredFavorites.length === 0 
                    ? 'No favorites found'
                    : `${filteredFavorites.length} favorite${filteredFavorites.length === 1 ? '' : 's'} found`
                  } for &quot;{searchQuery}&quot;
                </p>
              </div>
            )}

            {/* Favorites Grid/List */}
            {filteredFavorites.length === 0 && searchQuery ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No favorites match your search.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFavorites.map((favorite) => (
                  <div key={favorite.id} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        <Image
                          src={favorite.product?.images?.[0] || '/placeholder-product.jpg'}
                          alt={favorite.product?.name || 'Product'}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(favorite.productId, favorite.product?.name)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-1">{favorite.product?.category?.name}</p>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        <Link 
                          href={`/products/${favorite.product?.slug}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {favorite.product?.name}
                        </Link>
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        {favorite.product?.salePrice ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-primary-600">
                              ₹{favorite.product.salePrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{favorite.product.price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ₹{favorite.product?.price?.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddToCart(favorite.product)}
                          disabled={favorite.product?.stockQuantity === 0}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white py-2 px-3 rounded-lg font-medium transition-colors text-sm"
                        >
                          <ShoppingCart className="w-4 h-4 inline mr-1" />
                          {favorite.product?.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={() => handleRemoveFavorite(favorite.productId, favorite.product?.name)}
                          className="p-2 border border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFavorites.map((favorite) => (
                  <div key={favorite.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="flex">
                      <div className="w-48 h-48 relative">
                        <Image
                          src={favorite.product?.images?.[0] || '/placeholder-product.jpg'}
                          alt={favorite.product?.name || 'Product'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">{favorite.product?.category?.name}</p>
                            <h3 className="text-xl font-semibold text-gray-900">
                              <Link 
                                href={`/products/${favorite.product?.slug}`}
                                className="hover:text-primary-600 transition-colors"
                              >
                                {favorite.product?.name}
                              </Link>
                            </h3>
                          </div>
                          <div className="text-right">
                            {favorite.product?.salePrice ? (
                              <div>
                                <span className="text-lg font-bold text-primary-600">
                                  ₹{favorite.product.salePrice.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  ₹{favorite.product.price.toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">
                                ₹{favorite.product?.price?.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {favorite.product?.description && (
                          <p className="text-gray-700 mb-4 line-clamp-2">{favorite.product.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-500">SKU: {favorite.product?.sku}</span>
                            {favorite.product?.stockQuantity > 0 ? (
                              <span className="text-sm text-green-600 ml-4">In Stock</span>
                            ) : (
                              <span className="text-sm text-red-600 ml-4">Out of Stock</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleAddToCart(favorite.product)}
                              disabled={favorite.product?.stockQuantity === 0}
                              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              {favorite.product?.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                            <button
                              onClick={() => handleRemoveFavorite(favorite.productId, favorite.product?.name)}
                              className="p-2 border border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
