import Hero from '@/components/Hero'
import FeaturedCategories from '@/components/FeaturedCategories'
import FeaturedProducts from '@/components/FeaturedProducts'
import Newsletter from '@/components/Newsletter'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <Newsletter />
      <Footer />
    </main>
  )
}
