'use client'

import { useState } from 'react'
import { Mail, Gift, Crown, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Successfully subscribed to newsletter!')
        setEmail('')
      } else {
        toast.error(data.message || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    {
      icon: <Gift className="w-5 h-5" />,
      text: "Exclusive offers & early access"
    },
    {
      icon: <Crown className="w-5 h-5" />,
      text: "VIP member discounts"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: "New collection previews"
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-32 right-16 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-16 left-1/4 w-40 h-40 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-28 h-28 border border-white/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Mail className="w-8 h-8 text-primary-200" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Join Our Exclusive Circle
            </h2>
            
            <p className="text-lg md:text-xl text-primary-100 mb-6 max-w-2xl mx-auto">
              Be the first to discover our latest collections, enjoy special member prices, 
              and receive styling tips from our jewelry experts.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center md:justify-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-200">
                  {benefit.icon}
                </div>
                <span className="text-center md:text-left font-medium">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>

          {/* Newsletter Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-white text-primary-700 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </form>
            
            <p className="text-center text-primary-200 text-sm mt-4">
              By subscribing, you agree to our{' '}
              <a href="/privacy-policy" className="underline hover:text-white transition-colors">
                Privacy Policy
              </a>
              {' '}and{' '}
              <a href="/terms-conditions" className="underline hover:text-white transition-colors">
                Terms of Service
              </a>
            </p>
          </div>

          {/* Special Offer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="font-medium">
                Get 15% off your first order when you subscribe!
              </span>
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-8 text-center">
            <p className="text-primary-200 text-sm">
              Join 10,000+ jewelry lovers who get our exclusive updates
            </p>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 mt-4 text-primary-200">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Unsubscribe anytime</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Weekly updates only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
