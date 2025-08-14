import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { prisma } from './prisma'

export async function verifyAuth(request) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return { success: false, error: 'No token provided' }
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      return { success: false, error: 'User not found or inactive' }
    }

    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Invalid token' }
  }
}

export const verifyToken = verifyAuth;

export function requireAuth(handler, requireAdmin = false) {
  return async (request, context) => {
    const auth = await verifyAuth(request)

    if (!auth.success) {
      return NextResponse.json(
        { message: auth.error },
        { status: 401 }
      )
    }

    if (requireAdmin && auth.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      )
    }

    // Add user to request context
    request.user = auth.user

    return handler(request, context)
  }
}

export function generateToken(payload) {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET, { expiresIn: '7d' })
}

export function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

export function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}
