import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request, { params }) {
  try {
    const auth = await verifyToken(request)
    if (!auth.success || auth.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const heroSlide = await prisma.heroSlide.findUnique({
      where: { id: parseInt(id) }
    })

    if (!heroSlide) {
      return NextResponse.json({ message: 'Hero slide not found' }, { status: 404 })
    }

    return NextResponse.json({ heroSlide })
  } catch (error) {
    console.error('Get hero slide error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch hero slide' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await verifyToken(request)
    if (!auth.success || auth.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { title, subtitle, description, image, ctaText, ctaLink, isActive, order } = body

    // Check if hero slide exists
    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingSlide) {
      return NextResponse.json({ message: 'Hero slide not found' }, { status: 404 })
    }

    // Validate required fields
    if (!title || !image || !ctaText || !ctaLink) {
      return NextResponse.json(
        { message: 'Title, image, CTA text, and CTA link are required' },
        { status: 400 }
      )
    }

    const heroSlide = await prisma.heroSlide.update({
      where: { id: parseInt(id) },
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        image,
        ctaText,
        ctaLink,
        isActive: isActive !== undefined ? isActive : true,
        order: order !== undefined ? order : 0
      }
    })

    return NextResponse.json({ heroSlide })
  } catch (error) {
    console.error('Update hero slide error:', error)
    return NextResponse.json(
      { message: 'Failed to update hero slide' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyToken(request)
    if (!auth.success || auth.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Check if hero slide exists
    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingSlide) {
      return NextResponse.json({ message: 'Hero slide not found' }, { status: 404 })
    }

    await prisma.heroSlide.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Hero slide deleted successfully' })
  } catch (error) {
    console.error('Delete hero slide error:', error)
    return NextResponse.json(
      { message: 'Failed to delete hero slide' },
      { status: 500 }
    )
  }
}
