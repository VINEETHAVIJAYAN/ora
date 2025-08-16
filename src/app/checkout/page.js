'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Shield,
  Truck,
  CreditCard,
  Smartphone,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Building,
  CheckCircle
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import UpiPay from '@/components/UpiPay'

export default function CheckoutPage() {
  const [upiTxnId, setUpiTxnId] = useState("")
  const { items, getCartTotal, getCartCount, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  
  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  })
  
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [isGooglePayReady, setIsGooglePayReady] = useState(false)

  // Redirect if not authenticated or no items
  useEffect(() => {
    console.log('Checkout page - Auth status:', isAuthenticated, 'Items:', items)
    
    if (!isAuthenticated) {
      toast.error('Please login to continue')
      router.push('/login')
      return
    }
    
    if (items.length === 0) {
      toast.error('Your cart is empty')
      router.push('/cart')
      return
    }
  }, [isAuthenticated, items, router])

  // Initialize Google Pay
  useEffect(() => {
    const initializeGooglePay = async () => {
      if (typeof window !== 'undefined' && window.google?.payments?.api?.PaymentsClient) {
        try {
          const paymentsClient = new window.google.payments.api.PaymentsClient({
            environment: 'TEST' // Change to 'PRODUCTION' for live
          })

          const isReadyToPayRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [{
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX']
              }
            }]
          }

          const isReadyToPay = await paymentsClient.isReadyToPay(isReadyToPayRequest)
          setIsGooglePayReady(isReadyToPay.result)
          console.log('Google Pay ready:', isReadyToPay.result)
        } catch (error) {
          console.error('Google Pay initialization error:', error)
          setIsGooglePayReady(false)
        }
      }
    }

    // Load Google Pay API
    if (!window.google?.payments?.api?.PaymentsClient) {
      const script = document.createElement('script')
      script.src = 'https://pay.google.com/gp/p/js/pay.js'
      script.onload = () => {
        console.log('Google Pay script loaded')
        initializeGooglePay()
      }
      script.onerror = () => {
        console.error('Failed to load Google Pay script')
        setIsGooglePayReady(false)
      }
      document.head.appendChild(script)
    } else {
      initializeGooglePay()
    }
  }, [])

  const cartTotal = getCartTotal()
  const cartCount = getCartCount()
  const shippingCost = cartTotal > 5000 ? 0 : 200
  const tax = Math.round(cartTotal * 0.18) // 18% GST
  const finalTotal = cartTotal + shippingCost + tax
  
  console.log('Checkout totals - Cart:', cartTotal, 'Shipping:', shippingCost, 'Tax:', tax, 'Final:', finalTotal)

  const handleAddressSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    const required = ['fullName', 'email', 'phone', 'addressLine1', 'city', 'state', 'pincode']
    const missing = required.filter(field => !shippingAddress[field])
    
    if (missing.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingAddress.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(shippingAddress.phone)) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }
    
    // Pincode validation
    const pincodeRegex = /^\d{6}$/
    if (!pincodeRegex.test(shippingAddress.pincode)) {
      toast.error('Please enter a valid 6-digit pincode')
      return
    }
    
    setStep(2)
  }

  const handleGooglePay = async () => {
    if (!isGooglePayReady) {
      toast.error('Google Pay is not available on this device')
      return
    }

    setLoading(true)
    
    try {
      // Check if we're in demo mode (no real payment gateway configured)
      const isDemoMode = !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && !process.env.NEXT_PUBLIC_STRIPE_KEY

      if (isDemoMode) {
        // Demo mode - simulate Google Pay for testing
        toast.info('Demo mode: Simulating Google Pay payment...')
        
        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Process the order directly (skip actual Google Pay)
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            items: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.salePrice || item.product.price
            })),
            shippingAddress,
            paymentMethod: 'googlepay',
            paymentData: { demo: true, transactionId: 'DEMO_' + Date.now() },
            total: finalTotal
          })
        })

        const responseData = await response.json()
        console.log('Demo Google Pay response:', responseData, 'Status:', response.status)
        
        if (response.ok) {
          await clearCart()
          setOrderComplete(true)
          setStep(3)
          toast.success('Demo order placed successfully!')
        } else {
          console.error('Order creation failed:', responseData)
          toast.error(responseData.message || 'Order failed')
        }
      } else {
        // Real Google Pay integration
        const paymentsClient = new window.google.payments.api.PaymentsClient({
          environment: process.env.NEXT_PUBLIC_GOOGLE_PAY_ENVIRONMENT || 'TEST'
        })

        const paymentDataRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX']
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || 'razorpay',
                gatewayMerchantId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
              }
            }
          }],
          merchantInfo: {
            merchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID || '12345678901234567890',
            merchantName: 'ORA Fashions'
          },
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: finalTotal.toString(),
            currencyCode: 'INR',
            countryCode: 'IN'
          },
          callbackIntents: ['PAYMENT_AUTHORIZATION']
        }

        console.log('Google Pay request:', paymentDataRequest)
        const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest)
        console.log('Google Pay response:', paymentData)
        
        // Process the payment with your backend
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            items: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.salePrice || item.product.price
            })),
            shippingAddress,
            paymentMethod: 'googlepay',
            paymentData: paymentData,
            total: finalTotal
          })
        })

        if (response.ok) {
          const orderData = await response.json()
          await clearCart()
          setOrderComplete(true)
          setStep(3)
          toast.success('Order placed successfully!')
        } else {
          const error = await response.json()
          console.error('Order creation failed:', error)
          toast.error(error.message || 'Payment failed')
        }
      }
    } catch (error) {
      console.error('Google Pay error:', error)
      if (error.statusCode === 'CANCELED') {
        toast.info('Payment cancelled')
      } else {
        toast.error('Payment failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCashOnDelivery = async () => {
    setLoading(true)
    
    try {
      console.log('User authenticated:', isAuthenticated)
      console.log('Cart items:', items.length)
      console.log('Creating COD order with data:', {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.salePrice || item.product.price
        })),
        shippingAddress,
        paymentMethod: 'cod',
        total: finalTotal
      });

      const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            items: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.salePrice || item.product.price
            })),
            shippingAddress,
            paymentMethod: 'cod',
            total: finalTotal
          })
        })

        const responseData = await response.json()
        console.log('COD order response:', responseData, 'Status:', response.status, 'Response OK:', response.ok)

        if (response.ok) {
          console.log('Order successful, clearing cart...')
          await clearCart()
          console.log('Cart cleared, setting order complete...')
          setOrderComplete(true)
          setStep(3)
          toast.success('Order placed successfully!')
        } else {
          console.error('Order creation failed:', responseData)
          toast.error(responseData.message || 'Order failed')
        }
    } catch (error) {
      console.error('Order error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || items.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/cart"
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Cart
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                {orderComplete ? 'Order Confirmed' : 'Checkout'}
              </h1>
              <p className="text-gray-600">
                {orderComplete ? 'Thank you for your order!' : `Complete your purchase of ${cartCount} items`}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        {!orderComplete && (
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
                <span className="text-sm font-semibold">1</span>
              </div>
              <div className={`h-1 w-16 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
                <span className="text-sm font-semibold">2</span>
              </div>
              <div className={`h-1 w-16 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
                <span className="text-sm font-semibold">3</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-primary-600" />
                  Shipping Address
                </h2>
                
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={shippingAddress.fullName}
                          onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={shippingAddress.email}
                          onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter 10-digit mobile number"
                        maxLength="10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={shippingAddress.addressLine1}
                        onChange={(e) => setShippingAddress({...shippingAddress, addressLine1: e.target.value})}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="House/Flat number, Street name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={shippingAddress.addressLine2}
                        onChange={(e) => setShippingAddress({...shippingAddress, addressLine2: e.target.value})}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Landmark, Area"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="City"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="State"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="000000"
                        maxLength="6"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 mr-2 text-primary-600" />
                  Payment Method
                </h2>
                <div className="space-y-4">
                  {/* UPI Payment */}
                  <div className={`p-4 border-2 rounded-lg transition-colors ${paymentMethod === 'upi' ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="w-4 h-4 text-primary-600"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <Smartphone className="w-5 h-5 text-gray-600 mr-2" />
                          <span className="font-medium">UPI (Google Pay, PhonePe, Paytm, etc.)</span>
                        </div>
                        <p className="text-sm text-gray-600">Pay instantly using any UPI app. No extra charges.</p>
                      </div>
                    </div>
                  </div>
                  {/* Cash on Delivery */}
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 text-primary-600"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <Truck className="w-5 h-5 text-gray-600 mr-2" />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-gray-600">Pay when your order is delivered</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* UPI Payment UI */}
                {paymentMethod === 'upi' && (
                  <div className="mt-6">
                    <UpiPay amount={finalTotal} />
                    <div className="mt-4 text-sm text-gray-700">
                      After payment, please enter your UPI transaction ID below for order confirmation.
                    </div>
                    <input
                      type="text"
                      value={upiTxnId}
                      onChange={e => setUpiTxnId(e.target.value)}
                      placeholder="Enter UPI Transaction ID"
                      className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={async () => {
                      if (paymentMethod === 'upi') {
                        if (!upiTxnId.trim()) {
                          toast.error('Please enter your UPI transaction ID after payment.')
                          return
                        }
                        setLoading(true)
                        // Save order with UPI txn ID, mark as pending
                        try {
                          const response = await fetch('/api/orders', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                              items: items.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                price: item.product.salePrice || item.product.price
                              })),
                              shippingAddress,
                              paymentMethod: 'upi',
                              paymentData: { upiTxnId },
                              total: finalTotal
                            })
                          })
                          const responseData = await response.json()
                          if (response.ok) {
                            await clearCart()
                            setOrderComplete(true)
                            setStep(3)
                            toast.success('Order placed! We will verify your payment and confirm soon.')
                          } else {
                            toast.error(responseData.message || 'Order failed')
                          }
                        } catch (err) {
                          toast.error('Failed to place order. Please try again.')
                        } finally {
                          setLoading(false)
                        }
                      } else {
                        handleCashOnDelivery()
                      }
                    }}
                    disabled={loading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      `Place Order - ₹${finalTotal.toLocaleString()}`
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Order Confirmation */}
            {step === 3 && orderComplete && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your order. We&apos;ll send you a confirmation email shortly.
                </p>
                <div className="flex space-x-4 justify-center">
                  <Link
                    href="/products"
                    className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/account/orders"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    View Orders
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                        alt={item.product?.name || 'Product'}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product?.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity} × ₹{((item.product?.salePrice || item.product?.price || 0)).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ₹{((item.product?.salePrice || item.product?.price || 0) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 mb-4 pt-4 border-t border-gray-200">
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
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST 18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-600 mr-2" />
                  <span>256-bit SSL encrypted checkout</span>
                </div>
                <div className="flex items-center">
                  <Truck className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Free shipping on orders over ₹5,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
