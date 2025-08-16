import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET(request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.success) {
      return NextResponse.json({ favorites: [] }) // Return empty favorites for unauthenticated users
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: auth.user.id
      },
      include: {
        product: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ 
      favorites: favorites.filter(fav => fav.product?.isActive) // Only return active products
    })
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.success) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId), isActive: true }
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if already in favorites
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: auth.user.id,
          productId: parseInt(productId)
        }
      }
    })

    if (existingFavorite) {
      return NextResponse.json(
        { message: 'Product already in favorites', isFavorite: true },
        { status: 200 }
      )
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        userId: auth.user.id,
        productId: parseInt(productId)
      },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Added to favorites',
      favorite,
      isFavorite: true 
    })
  } catch (error) {
    console.error('Add to favorites error:', error)
    return NextResponse.json(
      { message: 'Failed to add to favorites' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.success) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Remove from favorites
    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: auth.user.id,
          productId: parseInt(productId)
        }
      }
    })

    return NextResponse.json({ 
      message: 'Removed from favorites',
      isFavorite: false 
    })
  } catch (error) {
    console.error('Remove from favorites error:', error)
    return NextResponse.json(
      { message: 'Failed to remove from favorites' },
      { status: 500 }
    )
  }
}
