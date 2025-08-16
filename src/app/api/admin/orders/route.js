import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET(request) {
  try {
    // Only allow admin users
    const auth = await verifyAuth(request)
    if (!auth.success || auth.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    // Fetch all orders with user info
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        items: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Admin get orders error:', error)
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 })
  }
}
