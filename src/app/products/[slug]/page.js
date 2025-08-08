'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      } else {
        router.push('/products')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      const result = await addToCart(product.id, quantity)
      if (result.success) {
        toast.success(`Added ${quantity} ${product.name} to cart!`)
      } else {
        toast.error(result.error || 'Failed to add to cart')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlist = async () => {
    setIsToggling(true)
    try {
      await toggleFavorite(product.id, product.name)
    } finally {
      setIsToggling(false)
    }
  }

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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const images = product.images?.length > 0 ? product.images : ['/placeholder-product.jpg']
  const currentPrice = product.salePrice || product.price

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <Link href={`/categories/${product.category?.slug}`} className="hover:text-primary-600">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-primary-600 font-medium">
                {product.category?.name}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                ₹{currentPrice.toLocaleString()}
              </span>
              {product.salePrice && (
                <span className="text-xl text-gray-500 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
              {product.salePrice && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                  Save ₹{(product.price - product.salePrice).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200">
              <div>
                <span className="text-sm font-medium text-gray-500">SKU</span>
                <p className="text-gray-900">{product.sku}</p>
              </div>
              {product.material && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Material</span>
                  <p className="text-gray-900">{product.material}</p>
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Weight</span>
                  <p className="text-gray-900">{product.weight}g</p>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Dimensions</span>
                  <p className="text-gray-900">{product.dimensions}</p>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.stockQuantity > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    In Stock ({product.stockQuantity} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="p-2 hover:bg-gray-50"
                    disabled={quantity >= product.stockQuantity}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0 || isAddingToCart}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
                >
                  {isAddingToCart ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <ShoppingCart className="w-5 h-5 mr-2" />
                  )}
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleWishlist}
                  disabled={isToggling}
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    isFavorite(product.id) 
                      ? 'border-red-500 text-red-500 bg-red-50' 
                      : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                  } ${isToggling ? 'opacity-50' : ''}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <p className="text-sm font-medium text-gray-700">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over ₹5,000</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <p className="text-sm font-medium text-gray-700">Warranty</p>
                <p className="text-xs text-gray-500">1 year guarantee</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <p className="text-sm font-medium text-gray-700">Returns</p>
                <p className="text-xs text-gray-500">30-day returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
