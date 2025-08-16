'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from 'lucide-react'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  // Default slides as fallback
  const defaultSlides = [
    {
      id: 1,
      title: "Exquisite Traditional Jewelry",
      subtitle: "Discover the Art of Timeless Elegance",
      description: "Handcrafted jewelry that tells your story with every piece",
      image: "/hero1.png",
      ctaText: "Shop Collection",
      ctaLink: "/products",
    },
    {
      id: 2,
      title: "Bridal Collection",
      subtitle: "Make Your Special Day Extraordinary",
      description: "Stunning bridal jewelry sets for your most precious moments",
      image: "/hero-2.jpg",
      ctaText: "View Bridal Sets",
      ctaLink: "/categories/bridal",
    },
    {
      id: 3,
      title: "Traditional Chains",
      subtitle: "Heritage Meets Modern Design",
      description: "Classic gold chains crafted with contemporary flair",
      image: "/hero-3.jpg",
      ctaText: "Explore Chains",
      ctaLink: "/categories/chains",
    },
  ]

  useEffect(() => {
    fetchHeroSlides()
  }, [])

  const fetchHeroSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides')
      if (response.ok) {
        const data = await response.json()
        if (data.heroSlides && data.heroSlides.length > 0) {
          setSlides(data.heroSlides.map(slide => ({
            id: slide.id,
            title: slide.title,
            subtitle: slide.subtitle,
            description: slide.description,
            image: slide.image,
            ctaText: slide.ctaText,
            ctaLink: slide.ctaLink
          })))
        } else {
          // Use default slides if no slides in database
          setSlides(defaultSlides)
        }
      } else {
        // Use default slides if API fails
        setSlides(defaultSlides)
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error)
      // Use default slides if fetch fails
      setSlides(defaultSlides)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (loading) {
    return (
      <div className="relative h-[400px] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!slides || slides.length === 0) {
    return null
  }

  return (
    <div className="relative h-[400px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white">
                <div className="animate-fadeIn">
                  <p className="text-primary-400 font-medium mb-4 text-lg">
                    {slide.subtitle}
                  </p>
                  <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl mb-8 text-gray-200 leading-relaxed">
                    {slide.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={slide.ctaLink}
                      className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors group"
                    >
                      <ShoppingBag size={20} className="mr-2" />
                      {slide.ctaText}
                    </Link>
                    
                    <Link
                      href="/about"
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                  
                  {/* Trust Indicators */}
                  <div className="flex items-center space-x-6 mt-8">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-300">4.9/5 Rating</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      10,000+ Happy Customers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors z-20"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors z-20"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-primary-400' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 hidden lg:block">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-center">
          <p className="text-2xl font-bold text-primary-400">25%</p>
          <p className="text-sm">OFF</p>
          <p className="text-xs">First Order</p>
        </div>
      </div>
    </div>
  )
}

export default Hero
