import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { AdminUser } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    await connectDB()
    const users = await AdminUser.find({}, '-password').sort({ createdAt: -1 }).lean()

    return successResponse(users)
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return errorResponse('Failed to fetch admin users', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const currentUserRole = authResult.session.user.role
    if (currentUserRole !== 'super_admin') {
      return errorResponse('Forbidden: Only super_admin can create admin users', 403)
    }

    const { email, password, name, role = 'admin', avatar } = await req.json()

    if (!email || !password || !name) {
      return errorResponse('Email, password, and name are required', 400)
    }

    await connectDB()

    const existingUser = await AdminUser.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return errorResponse('Email already registered', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await AdminUser.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
      avatar,
    })

    const userObj = user.toObject()
    delete userObj.password

    return successResponse(userObj, 'Admin user created successfully', 201)
  } catch (error) {
    console.error('Error creating admin user:', error)
    return errorResponse('Failed to create admin user', 500)
  }
}
