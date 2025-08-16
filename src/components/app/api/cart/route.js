import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET(request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.success) {
      return NextResponse.json({ items: [] }) // Return empty cart for unauthenticated users
    }

    const cartItems = await prisma.cartItem.findMany({
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

    return NextResponse.json({ items: cartItems })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch cart' },
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

    const { productId, quantity = 1 } = await request.json()

    if (!productId || quantity <= 0) {
      return NextResponse.json(
        { message: 'Valid product ID and quantity required' },
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

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: auth.user.id,
          productId: parseInt(productId)
        }
      }
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      })
      return NextResponse.json({ item: updatedItem })
    } else {
      // Create new cart item
      const cartItem = await prisma.cartItem.create({
        data: {
          userId: auth.user.id,
          productId: parseInt(productId),
          quantity: quantity
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      })
      return NextResponse.json({ item: cartItem })
    }
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { message: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.success) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId, quantity } = await request.json()

    if (!productId || quantity < 0) {
      return NextResponse.json(
        { message: 'Valid product ID and quantity required' },
        { status: 400 }
      )
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: auth.user.id,
            productId: parseInt(productId)
          }
        }
      })
      return NextResponse.json({ message: 'Item removed from cart' })
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: auth.user.id,
          productId: parseInt(productId)
        }
      },
      data: { quantity },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { message: 'Failed to update cart' },
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
        { message: 'Product ID required' },
        { status: 400 }
      )
    }

    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: auth.user.id,
          productId: parseInt(productId)
        }
      }
    })

    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('Remove from cart error:', error)
    return NextResponse.json(
      { message: 'Failed to remove from cart' },
      { status: 500 }
    )
  }
}
