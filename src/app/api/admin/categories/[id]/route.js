import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

async function getCategory(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Get category error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

async function updateCategory(request, { params }) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    
    const {
      name,
      description,
      slug,
      image,
      isActive,
      metaTitle,
      metaDescription
    } = data

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if slug already exists for other categories
    if (slug !== existingCategory.slug) {
      const existingSlug = await prisma.category.findUnique({
        where: { slug }
      })

      if (existingSlug && existingSlug.id !== id) {
        return NextResponse.json(
          { message: 'Category slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update the category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        slug,
        image,
        isActive,
        metaTitle,
        metaDescription,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json(
      { message: 'Failed to update category' },
      { status: 500 }
    )
  }
}

async function deleteCategory(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { message: 'Cannot delete category with products. Please move products to another category first.' },
        { status: 400 }
      )
    }

    // Delete the category
    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Category deleted successfully' }
    )
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { message: 'Failed to delete category' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(getCategory, true)
export const PUT = requireAuth(updateCategory, true)
export const DELETE = requireAuth(deleteCategory, true)
