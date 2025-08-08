import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const FeaturedCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Traditional Chains',
      slug: 'chains',
      image: '/category-chains.jpg',
      description: 'Elegant gold and silver chains',
      productCount: 45,
      featured: true
    },
    {
      id: 2,
      name: 'Exquisite Earrings',
      slug: 'earrings',
      image: '/category-earrings.jpg',
      description: 'Stunning traditional and modern earrings',
      productCount: 78,
      featured: true
    },
    {
      id: 3,
      name: 'Beautiful Bangles',
      slug: 'bangles',
      image: '/category-bangles.jpg',
      description: 'Handcrafted bangles in various designs',
      productCount: 32,
      featured: true
    },
    {
      id: 4,
      name: 'Elegant Rings',
      slug: 'rings',
      image: '/category-rings.jpg',
      description: 'Timeless rings for every occasion',
      productCount: 56,
      featured: false
    },
    {
      id: 5,
      name: 'Majestic Necklaces',
      slug: 'necklaces',
      image: '/category-necklaces.jpg',
      description: 'Statement necklaces and sets',
      productCount: 29,
      featured: false
    },
    {
      id: 6,
      name: 'Charming Bracelets',
      slug: 'bracelets',
      image: '/category-bracelets.jpg',
      description: 'Delicate and bold bracelet designs',
      productCount: 41,
      featured: false
    }
  ]

  const featuredCategories = categories.filter(cat => cat.featured)
  const otherCategories = categories.filter(cat => !cat.featured)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Explore Our Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated categories of traditional and contemporary jewelry, 
            each piece crafted with love and attention to detail.
          </p>
        </div>

        {/* Featured Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-200 mb-3 opacity-90">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      {category.productCount} Products
                    </span>
                    <div className="flex items-center text-sm group-hover:text-primary-400 transition-colors">
                      <span className="mr-2">Shop Now</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* Other Categories */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
            More Categories
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {otherCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h4 className="font-medium mb-1 group-hover:text-primary-400 transition-colors">
                    {category.name}
                  </h4>
                  <p className="text-xs text-gray-300 mb-2">
                    {category.productCount} items
                  </p>
                  <div className="flex items-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="mr-1">View All</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors group"
          >
            View All Categories
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCategories
