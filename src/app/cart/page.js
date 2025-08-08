'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Heart,
  Tag,
  Truck,
  Shield,
  AlertCircle
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, loading, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState({})

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return
    
    setIsUpdating(prev => ({ ...prev, [productId]: true }))
    try {
      const result = await updateQuantity(productId, newQuantity)
      if (!result.success) {
        toast.error(result.error || 'Failed to update quantity')
      }
    } finally {
      setIsUpdating(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleRemoveItem = async (productId, productName) => {
    const result = await removeFromCart(productId)
    if (result.success) {
      toast.success(`${productName} removed from cart`)
    } else {
      toast.error(result.error || 'Failed to remove item')
    }
  }

  const handleClearCart = async () => {
    if (items.length === 0) return
    
    const result = await clearCart()
    if (result.success) {
      toast.success('Cart cleared')
    } else {
      toast.error(result.error || 'Failed to clear cart')
    }
  }

  const cartTotal = getCartTotal()
  const cartCount = getCartCount()
  const shippingCost = cartTotal > 5000 ? 0 : 200
  const finalTotal = cartTotal + shippingCost

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
                <ShoppingBag className="w-8 h-8 mr-3 text-primary-600" />
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet. 
              Start shopping to fill it up!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                            alt={item.product?.name || 'Product'}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              <Link 
                                href={`/products/${item.product?.slug}`}
                                className="hover:text-primary-600 transition-colors"
                              >
                                {item.product?.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {item.product?.category?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              SKU: {item.product?.sku}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              {item.product?.salePrice ? (
                                <>
                                  <span className="text-lg font-bold text-primary-600">
                                    ₹{item.product.salePrice.toLocaleString()}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    ₹{item.product.price.toLocaleString()}
                                  </span>
                                </>
                              ) : (
                                <span className="text-lg font-bold text-gray-900">
                                  ₹{item.product?.price?.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Total: ₹{((item.product?.salePrice || item.product?.price || 0) * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isUpdating[item.productId]}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 text-center min-w-[60px] font-medium">
                                {isUpdating[item.productId] ? '...' : item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                disabled={item.quantity >= (item.product?.stockQuantity || 0) || isUpdating[item.productId]}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors">
                              <Heart className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.productId, item.product?.name)}
                              className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Stock Warning */}
                        {item.product?.stockQuantity && item.quantity > item.product.stockQuantity && (
                          <div className="flex items-center space-x-2 mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-yellow-800">
                              Only {item.product.stockQuantity} items available
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        `₹${shippingCost.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {shippingCost > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-800">
                        Add ₹{(5000 - cartTotal).toLocaleString()} more for FREE shipping
                      </span>
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error('Please login to continue')
                      router.push('/login')
                    } else {
                      router.push('/checkout')
                    }
                  }}
                >
                  Proceed to Checkout
                </button>

                {/* Features */}
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Free shipping on orders over ₹5,000</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-purple-600" />
                    <span>Best price guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
