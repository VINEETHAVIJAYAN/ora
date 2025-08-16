import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

async function getCategories(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          _count: {
            select: {
              products: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.category.count({ where })
    ])

    return NextResponse.json({
      categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

async function createCategory(request) {
  try {
    console.log('CreateCategory function called')
    console.log('User from request:', request.user)
    
    const data = await request.json()
    console.log('Request data received:', data)
    
    const {
      name,
      description,
      slug,
      image,
      isActive = true,
      metaTitle,
      metaDescription
    } = data

    // Validate required fields
    if (!name) {
      console.log('Validation failed: missing name')
      return NextResponse.json(
        { message: 'Category name is required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    console.log('Generated slug:', categorySlug)

    // Check if slug already exists
    const existingSlug = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })

    if (existingSlug) {
      console.log('Slug already exists:', categorySlug)
      return NextResponse.json(
        { message: 'Category slug already exists' },
        { status: 400 }
      )
    }

    // Create the category
    console.log('Creating category with data:', {
      name,
      description,
      slug: categorySlug,
      image,
      isActive,
      metaTitle,
      metaDescription
    })
    
    const category = await prisma.category.create({
      data: {
        name,
        description,
        slug: categorySlug,
        image,
        isActive,
        metaTitle,
        metaDescription
      }
    })

    console.log('Category created successfully:', category)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { message: 'Failed to create category' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(getCategories, true)
export const POST = requireAuth(createCategory, true)
