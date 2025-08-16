'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, Truck, User, CreditCard, CheckCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/orders', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      } else {
        toast.error('Failed to fetch orders')
      }
    } catch (error) {
      toast.error('Error fetching orders')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin - All Orders</h1>
        {loading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">No orders found.</div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold">{order.user?.name || 'Customer'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="text-sm">{order.paymentMethod}</span>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-medium">Order #: </span>{order.orderNumber}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Total: </span>₹{order.total}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Status: </span>{order.status}
                </div>
                <div className="flex space-x-4 mt-4">
                  <Link href={`/admin/orders/${order.id}`} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
