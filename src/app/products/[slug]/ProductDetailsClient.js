'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Share2
} from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import toast from 'react-hot-toast'

export default function ProductDetailsClient({ product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast.success('Added to cart!')
  }

  const handleFavoriteToggle = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
      toast.success('Removed from favorites')
    } else {
      addToFavorites(product)
      toast.success('Added to favorites')
    }
  }

  const discountPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-primary-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${product.category?.slug}`}
          className="hover:text-primary-600"
        >
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Products
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={
                  product.images?.[selectedImage] || "/placeholder-product.jpg"
                }
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.salePrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-primary-600 font-medium mb-2">
                {product.category?.name}
              </p>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  ₹{(product.salePrice !== undefined && product.salePrice !== null ? product.salePrice : product.price).toLocaleString()}
                </span>
                {product.salePrice !== undefined && product.salePrice !== null && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.price > product.salePrice && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        Save ₹{(product.price - product.salePrice).toLocaleString()}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stockQuantity > 0 ? (
                  <div className="flex items-center text-green-600">
                    <Shield size={16} className="mr-2" />
                    <span className="text-sm font-medium">
                      In Stock ({product.stockQuantity} available)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <Shield size={16} className="mr-2" />
                    <span className="text-sm font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Details */}
            <div className="space-y-3 py-4 border-t border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">SKU</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              {product.material && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Material</span>
                  <span className="font-medium">{product.material}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium">{product.weight}g</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions</span>
                  <span className="font-medium">{product.dimensions}</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stockQuantity > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stockQuantity, quantity + 1))
                    }
                    className="p-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity >= product.stockQuantity}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="flex-1 flex items-center justify-center px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                <ShoppingCart size={20} className="mr-2" />
                {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                onClick={handleFavoriteToggle}
                className={`px-6 py-3 border-2 rounded-lg font-semibold transition-colors ${
                  isFavorite(product.id)
                    ? "border-red-500 text-red-500 bg-red-50"
                    : "border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-500"
                }`}
              >
                <Heart
                  size={20}
                  className={isFavorite(product.id) ? "fill-current" : ""}
                />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Truck size={20} className="text-primary-600" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Shield size={20} className="text-primary-600" />
                <span>Secure Payment</span>
              </div>
              {/* <div className="flex items-center space-x-3 text-sm text-gray-600">
                <RotateCcw size={20} className="text-primary-600" />
                <span>Easy Returns</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
