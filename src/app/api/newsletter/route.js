import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email }
    })

    if (existingSubscription) {
      return NextResponse.json(
        { message: 'Email is already subscribed' },
        { status: 409 }
      )
    }

    // Create new subscription
    const subscription = await prisma.newsletterSubscription.create({
      data: {
        email,
        isActive: true
      }
    })

    return NextResponse.json(
      { 
        message: 'Successfully subscribed to newsletter!',
        subscription: { id: subscription.id, email: subscription.email }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { message: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}
