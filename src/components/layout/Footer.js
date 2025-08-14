import Link from 'next/link'
import Image from 'next/image'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Features Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-full mb-4">
                <Truck size={24} />
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-400 text-sm">
                Free delivery on orders above ₹5000
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-full mb-4">
                <Shield size={24} />
              </div>
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-400 text-sm">
                100% secure payment processing
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-full mb-4">
                <RotateCcw size={24} />
              </div>
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-400 text-sm">
                30-day hassle-free returns
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-full mb-4">
                <CreditCard size={24} />
              </div>
              <h3 className="font-semibold mb-2">Multiple Payment</h3>
              <p className="text-gray-400 text-sm">
                Various payment methods accepted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.jpeg"
                  alt="ORA Fashions"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-primary-400">
                  ORA
                </h2>
                <p className="text-xs text-gray-400 -mt-1">FASHIONZ</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Discover the finest collection of traditional jewelry crafted with
              love and precision. Each piece tells a story of heritage and
              elegance.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/care-instructions"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Jewelry Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/categories/chains"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Chains
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/earrings"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Earrings
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/bangles"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Bangles
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/rings"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Rings
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/necklaces"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Necklaces
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/bracelets"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin
                  size={20}
                  className="text-primary-400 mt-1 flex-shrink-0"
                />
                <div className="text-gray-400">
                  <p>123 Jewelry Street,</p>
                  <p>Fashion District,</p>
                  <p>Mumbai, Maharashtra 400001</p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-primary-400 flex-shrink-0" />
                <div className="text-gray-400">
                  <p>+91 80897 15616</p>
                  <p>+91 95269 43877</p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-primary-400 flex-shrink-0" />
                <div className="text-gray-400">
                  <p>info@orafashions.com</p>
                  <p>support@orafashions.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
            <p className="text-gray-400 mb-6">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} ORA Fashions. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-conditions"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/cookie-policy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer
