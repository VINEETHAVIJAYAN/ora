import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const heroSlides = await prisma.heroSlide.findMany({
      where: { isActive: true },
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
