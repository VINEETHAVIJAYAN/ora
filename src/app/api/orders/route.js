import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function POST(request) {
  try {
    console.log('Orders API called')
    
    const auth = await verifyAuth(request)
    if (!auth.success) {
      console.log('Auth failed:', auth)
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    console.log('User authenticated:', auth.user)

    const requestData = await request.json()
    console.log('Request data received:', requestData)
    
    const { items, shippingAddress, paymentMethod, paymentData, total } = requestData

    if (!items || items.length === 0) {
      console.log('No items in request:', items)
      return NextResponse.json(
        { message: 'No items in order' },
        { status: 400 }
      )
    }

    console.log('Items validated, count:', items.length)

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.email) {
      console.log('Invalid shipping address:', shippingAddress)
      return NextResponse.json(
        { message: 'Shipping address is required' },
        { status: 400 }
      )
    }

    console.log('Shipping address validated')

    // Validate items and calculate total
    let calculatedTotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { 
          id: parseInt(item.productId),
          isActive: true 
        }
      })

      if (!product) {
        console.log('Product not found:', item.productId)
        return NextResponse.json(
          { message: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      if (product.stockQuantity < item.quantity) {
        console.log('Insufficient stock for product:', product.name, 'Stock:', product.stockQuantity, 'Requested:', item.quantity)
        return NextResponse.json(
          { message: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }

      const itemPrice = product.salePrice || product.price
      calculatedTotal += itemPrice * item.quantity

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: itemPrice,
        product: product
      })
    }

    console.log('Items processed. Calculated subtotal:', calculatedTotal)

    // Add shipping and tax
    const shippingCost = calculatedTotal > 5000 ? 0 : 200
    const tax = Math.round(calculatedTotal * 0.18) // 18% GST
    const finalTotal = calculatedTotal + shippingCost + tax
    
    console.log('Final calculations - Shipping:', shippingCost, 'Tax:', tax, 'Final Total:', finalTotal, 'Received Total:', total)

    // Verify total matches frontend calculation
    if (Math.abs(finalTotal - total) > 1) { // Allow 1 rupee difference for rounding
      console.log('Total mismatch - Expected:', finalTotal, 'Received:', total, 'Difference:', Math.abs(finalTotal - total))
      return NextResponse.json(
        { message: 'Total amount mismatch' },
        { status: 400 }
      )
    }

    console.log('Total verified, creating order...')

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    console.log('Generated order number:', orderNumber)

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber,
        userId: auth.user.id,
        total: finalTotal,
        subtotal: calculatedTotal,
        shippingCost: shippingCost,
        tax: tax,
        status: paymentMethod === 'cod' ? 'PENDING' : 'PENDING', // Both start as PENDING
        paymentMethod: paymentMethod.toUpperCase(),
        paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'COMPLETED',
        shippingAddress: JSON.stringify(shippingAddress),
        items: {
          create: orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Update product stock quantities
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity
          }
        }
      })
    }

    // Store payment data if Google Pay
    if (paymentMethod === 'googlepay' && paymentData) {
      // In a real application, you would process the payment with your payment gateway
      // For now, we'll just log it (don't do this in production)
      console.log('Google Pay payment data received for order:', order.id)
    }

    // Create loyalty points (1 point per ₹100 spent)
    const pointsEarned = Math.floor(finalTotal / 100)
    if (pointsEarned > 0) {
      await prisma.loyaltyPoint.create({
        data: {
          userId: auth.user.id,
          orderId: order.id,
          points: pointsEarned,
          type: 'EARNED',
          description: `Points earned for order #${order.id}`
        }
      })
    }

    return NextResponse.json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        pointsEarned
      }
    })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.success) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: auth.user.id
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
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

    return NextResponse.json({ orders })

  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
