import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET(request, { params }) {
  try {
    const { productId } = params
    const auth = await verifyAuth(request)
    
    if (!auth.success) {
      return NextResponse.json({ isFavorite: false })
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: auth.user.id,
          productId: parseInt(productId)
        }
      }
    })

    return NextResponse.json({ isFavorite: !!favorite })
  } catch (error) {
    console.error('Check favorite status error:', error)
    return NextResponse.json({ isFavorite: false })
  }
}
