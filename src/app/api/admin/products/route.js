import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

async function getProducts(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(categoryId && { categoryId: parseInt(categoryId) })
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

async function createProduct(request) {
  try {
    console.log('CreateProduct function called')
    console.log('User from request:', request.user)
    
    const data = await request.json()
    console.log('Request data received:', data)
    
    const {
      name,
      description,
      price,
      salePrice,
      sku,
      categoryId,
      stockQuantity,
      weight,
      material,
      dimensions,
      images,
      tags,
      isActive = true,
      isFeatured = false,
      metaTitle,
      metaDescription
    } = data

    // Validate required fields
    if (!name || !price || !sku || !categoryId) {
      console.log('Validation failed: missing required fields')
      return NextResponse.json(
        { message: 'Name, price, SKU, and category are required' },
        { status: 400 }
      )
    }

    console.log('Validation passed, checking SKU uniqueness')

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    console.log('Generated slug:', slug)

    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({
      where: { sku }
    })

    if (existingSku) {
      console.log('SKU already exists:', sku)
      return NextResponse.json(
        { message: 'SKU already exists' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingSlug = await prisma.product.findUnique({
      where: { slug }
    })

    if (existingSlug) {
      console.log('Slug already exists:', slug)
      return NextResponse.json(
        { message: 'Product slug already exists' },
        { status: 400 }
      )
    }

    console.log('SKU is unique, creating product')

    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        sku,
        categoryId: parseInt(categoryId),
        stockQuantity: parseInt(stockQuantity) || 0,
        weight: weight ? parseFloat(weight) : null,
        material,
        dimensions,
        images: images || [],
        tags: tags || [],
        isActive,
        isFeatured,
        metaTitle,
        metaDescription
      },
      include: {
        category: true
      }
    })

    console.log('Product created successfully:', product)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(getProducts, true)
export const POST = requireAuth(createProduct, true)
