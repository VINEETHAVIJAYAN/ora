import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

async function handler(request) {
  try {
    // Get dashboard statistics
    const [
      totalProducts,
      totalCategories,
      totalOrders,
      totalUsers,
      revenueResult
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: 'COMPLETED'
        }
      })
    ])

    const stats = {
      totalProducts,
      totalCategories,
      totalOrders,
      totalUsers,
      totalRevenue: revenueResult._sum.totalAmount || 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(handler, true) // Require admin access
