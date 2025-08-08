'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { ArrowRight } from 'lucide-react'

const FeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('featured')

  const tabs = [
    { id: 'featured', label: 'Featured', icon: '⭐' },
    { id: 'latest', label: 'Latest', icon: '🆕' },
    { id: 'sale', label: 'On Sale', icon: '🏷️' },
    { id: 'popular', label: 'Popular', icon: '🔥' }
  ]

  // Mock data - replace with actual API call
  const mockProducts = [
    {
      id: '1',
      name: 'Traditional Gold Chain',
      slug: 'traditional-gold-chain',
      price: 45000,
      salePrice: 38250,
      images: ['/product-1.jpg', '/product-1-2.jpg'],
      category: { name: 'Chains', slug: 'chains' },
      isOnSale: true,
      isFeatured: true,
      rating: 4.8,
      reviewCount: 24,
      shortDescription: 'Elegant 22K gold chain with intricate design'
    },
    {
      id: '2',
      name: 'Pearl Drop Earrings',
      slug: 'pearl-drop-earrings',
      price: 12000,
      images: ['/product-2.jpg'],
      category: { name: 'Earrings', slug: 'earrings' },
      isOnSale: false,
      isFeatured: true,
      rating: 4.9,
      reviewCount: 18,
      shortDescription: 'Stunning pearl earrings with gold accents'
    },
    {
      id: '3',
      name: 'Designer Silver Bangles Set',
      slug: 'designer-silver-bangles-set',
      price: 8500,
      salePrice: 7650,
      images: ['/product-3.jpg'],
      category: { name: 'Bangles', slug: 'bangles' },
      isOnSale: true,
      isFeatured: true,
      rating: 4.7,
      reviewCount: 31,
      shortDescription: 'Set of 4 handcrafted silver bangles'
    },
    {
      id: '4',
      name: 'Kundan Necklace Set',
      slug: 'kundan-necklace-set',
      price: 65000,
      images: ['/product-4.jpg'],
      category: { name: 'Necklaces', slug: 'necklaces' },
      isOnSale: false,
      isFeatured: true,
      rating: 5.0,
      reviewCount: 12,
      shortDescription: 'Exquisite kundan necklace with earrings'
    },
    {
      id: '5',
      name: 'Diamond Ring',
      slug: 'diamond-ring',
      price: 85000,
      salePrice: 76500,
      images: ['/product-5.jpg'],
      category: { name: 'Rings', slug: 'rings' },
      isOnSale: true,
      isFeatured: false,
      rating: 4.9,
      reviewCount: 8,
      shortDescription: 'Brilliant cut diamond ring in white gold'
    },
    {
      id: '6',
      name: 'Temple Jewelry Set',
      slug: 'temple-jewelry-set',
      price: 95000,
      images: ['/product-6.jpg'],
      category: { name: 'Sets', slug: 'sets' },
      isOnSale: false,
      isFeatured: true,
      rating: 4.8,
      reviewCount: 15,
      shortDescription: 'Traditional temple jewelry complete set'
    },
    {
      id: '7',
      name: 'Gold Bracelet',
      slug: 'gold-bracelet',
      price: 28000,
      salePrice: 25200,
      images: ['/product-7.jpg'],
      category: { name: 'Bracelets', slug: 'bracelets' },
      isOnSale: true,
      isFeatured: false,
      rating: 4.6,
      reviewCount: 22,
      shortDescription: 'Delicate gold bracelet with charms'
    },
    {
      id: '8',
      name: 'Antique Choker',
      slug: 'antique-choker',
      price: 42000,
      images: ['/product-8.jpg'],
      category: { name: 'Necklaces', slug: 'necklaces' },
      isOnSale: false,
      isFeatured: true,
      rating: 4.7,
      reviewCount: 19,
      shortDescription: 'Vintage-style antique gold choker'
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      setLoading(true)
      
      // Filter products based on active tab
      let filteredProducts = [...mockProducts]
      
      switch (activeTab) {
        case 'featured':
          filteredProducts = filteredProducts.filter(p => p.isFeatured)
          break
        case 'latest':
          // Sort by newest (mock - in real app, sort by createdAt)
          filteredProducts = filteredProducts.slice().reverse()
          break
        case 'sale':
          filteredProducts = filteredProducts.filter(p => p.isOnSale)
          break
        case 'popular':
          // Sort by rating and review count
          filteredProducts = filteredProducts.sort((a, b) => 
            (b.rating * b.reviewCount) - (a.rating * a.reviewCount)
          )
          break
        default:
          break
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProducts(filteredProducts.slice(0, 8))
      setLoading(false)
    }

    fetchProducts()
  }, [activeTab])

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Discover our handpicked selection of exquisite jewelry pieces, 
            each crafted to perfection and designed to make you shine.
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors group"
              >
                View All Products
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default FeaturedProducts
