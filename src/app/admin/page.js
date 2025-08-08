'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login')
      return
    }
    
    fetchDashboardData()
  }, [isAuthenticated, isAdmin])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard statistics
      const [statsRes, productsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/products?limit=5')
      ])
      
      if (statsRes.ok && productsRes.ok) {
        const statsData = await statsRes.json()
        const productsData = await productsRes.json()
        
        setStats(statsData)
        setRecentProducts(productsData.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  const quickActions = [
    {
      title: 'Add Product',
      description: 'Add a new jewelry item',
      href: '/admin/products/new',
      icon: <Package className="w-6 h-6" />,
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: 'Add Category',
      description: 'Create a new category',
      href: '/admin/categories/new',
      icon: <Tags className="w-6 h-6" />,
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'View Orders',
      description: 'Manage customer orders',
      href: '/admin/orders',
      icon: <ShoppingCart className="w-6 h-6" />,
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'Manage Users',
      description: 'View and manage users',
      href: '/admin/users',
      icon: <Users className="w-6 h-6" />,
      bgColor: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ]

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Package className="w-8 h-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: <Tags className="w-8 h-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingCart className="w-8 h-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue?.toLocaleString('en-IN') || '0'}`,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Here's what's happening with your jewelry store.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`${action.bgColor} ${action.hoverColor} text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Product Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Package className="w-6 h-6 mr-2 text-primary-600" />
                Product Management
              </h3>
              <Link
                href="/admin/products"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-gray-500" />
                  View Products
                </span>
                <span className="text-primary-600">→</span>
              </Link>
              <Link
                href="/admin/products/new"
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="flex items-center">
                  <Plus className="w-4 h-4 mr-2 text-gray-500" />
                  Add New Product
                </span>
                <span className="text-primary-600">→</span>
              </Link>
            </div>
          </div>

          {/* Category Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Tags className="w-6 h-6 mr-2 text-primary-600" />
                Category Management
              </h3>
              <Link
                href="/admin/categories"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              <Link
                href="/admin/categories"
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-gray-500" />
                  View Categories
                </span>
                <span className="text-primary-600">→</span>
              </Link>
              <Link
                href="/admin/categories/new"
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="flex items-center">
                  <Plus className="w-4 h-4 mr-2 text-gray-500" />
                  Add New Category
                </span>
                <span className="text-primary-600">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        {recentProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Recent Products</h3>
              <Link
                href="/admin/products"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View All Products
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Stock</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{product.category?.name}</td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        ₹{product.price?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stockQuantity > 10 
                            ? 'bg-green-100 text-green-800'
                            : product.stockQuantity > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stockQuantity} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
