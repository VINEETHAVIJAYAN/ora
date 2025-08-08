import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function POST(request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.success) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: auth.user.id
      }
    })

    return NextResponse.json({ message: 'Cart cleared successfully' })
  } catch (error) {
    console.error('Clear cart error:', error)
    return NextResponse.json(
      { message: 'Failed to clear cart' },
      { status: 500 }
    )
  }
}
