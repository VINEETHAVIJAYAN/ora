import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const auth = await verifyToken(request)
    if (!auth.success || auth.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const heroSlides = await prisma.heroSlide.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ heroSlides })
  } catch (error) {
    console.error('Get hero slides error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch hero slides' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const auth = await verifyToken(request)
    if (!auth.success || auth.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, subtitle, description, image, ctaText, ctaLink, isActive, order } = body

    // Validate required fields
    if (!title || !image || !ctaText || !ctaLink) {
      return NextResponse.json(
        { message: 'Title, image, CTA text, and CTA link are required' },
        { status: 400 }
      )
    }

    try {
      const heroSlide = await prisma.heroSlide.create({
        data: {
          title,
          subtitle: subtitle || null,
          description: description || null,
          image,
          ctaText,
          ctaLink,
          isActive: isActive !== undefined ? isActive : true,
          order: order || 0
        }
      })
      return NextResponse.json({ heroSlide }, { status: 201 })
    } catch (prismaError) {
      console.error('Prisma error:', prismaError)
      return NextResponse.json(
        { message: 'Prisma error', error: prismaError.message, stack: prismaError.stack },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Create hero slide error:', error)
    return NextResponse.json(
      { message: 'Failed to create hero slide', error: error.message, stack: error.stack },
      { status: 500 }
    )
  }
}
