import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { AdminUser } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'
import { Types } from 'mongoose'
import bcrypt from 'bcryptjs'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid user ID', 400)
    }

    await connectDB()
    const user = await AdminUser.findById(id, '-password').lean()

    if (!user) {
      return errorResponse('User not found', 404)
    }

    return successResponse(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return errorResponse('Failed to fetch user', 500)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid user ID', 400)
    }

    const currentUserId = authResult.session.user.id
    const currentUserRole = authResult.session.user.role

    // Only super_admin or the user themselves can edit
    if (currentUserRole !== 'super_admin' && currentUserId !== id) {
      return errorResponse('Forbidden: You can only update your own profile', 403)
    }

    const data = await req.json()
    await connectDB()

    const user = await AdminUser.findById(id)
    if (!user) {
      return errorResponse('User not found', 404)
    }

    // Role escalation check: only super_admin can change roles
    if (data.role && data.role !== user.role) {
      if (currentUserRole !== 'super_admin') {
        return errorResponse('Forbidden: Only super_admin can change roles', 403)
      }
    }

    if (data.email) {
      user.email = data.email.toLowerCase()
    }
    if (data.name) {
      user.name = data.name
    }
    if (data.role) {
      user.role = data.role
    }
    if (data.avatar !== undefined) {
      user.avatar = data.avatar
    }

    // Handle password change if provided
    if (data.password) {
      if (data.password.length < 8) {
        return errorResponse('Password must be at least 8 characters', 400)
      }
      user.password = await bcrypt.hash(data.password, 10)
    }

    await user.save()

    const userObj = user.toObject()
    delete userObj.password

    return successResponse(userObj, 'User updated successfully')
  } catch (error) {
    console.error('Error updating user:', error)
    return errorResponse('Failed to update user', 500)
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid user ID', 400)
    }

    const currentUserId = authResult.session.user.id
    const currentUserRole = authResult.session.user.role

    // Only super_admin can delete users
    if (currentUserRole !== 'super_admin') {
      return errorResponse('Forbidden: Only super_admin can delete users', 403)
    }

    // Prevent deleting self
    if (currentUserId === id) {
      return errorResponse('Conflict: You cannot delete your own account', 400)
    }

    await connectDB()
    const user = await AdminUser.findByIdAndDelete(id)

    if (!user) {
      return errorResponse('User not found', 404)
    }

    return successResponse({ id }, 'User deleted successfully')
  } catch (error) {
    console.error('Error deleting user:', error)
    return errorResponse('Failed to delete user', 500)
  }
}
