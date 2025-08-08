import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

async function getProduct(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

async function updateProduct(request, { params }) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    
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
      isActive,
      isFeatured,
      metaTitle,
      metaDescription
    } = data

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if SKU already exists for other products
    if (sku !== existingProduct.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku }
      })

      if (existingSku && existingSku.id !== id) {
        return NextResponse.json(
          { message: 'SKU already exists' },
          { status: 400 }
        )
      }
    }

    // Update the product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
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
        metaDescription,
        updatedAt: new Date()
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { message: 'Failed to update product' },
      { status: 500 }
    )
  }
}

async function deleteProduct(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete related records first
    await prisma.cartItem.deleteMany({
      where: { productId: id }
    })

    await prisma.favorite.deleteMany({
      where: { productId: id }
    })

    await prisma.review.deleteMany({
      where: { productId: id }
    })

    // Delete the product
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Product deleted successfully' }
    )
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { message: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(getProduct, true)
export const PUT = requireAuth(updateProduct, true)
export const DELETE = requireAuth(deleteProduct, true)
