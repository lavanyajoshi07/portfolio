import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { TechnologyCategory } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    const categories = await TechnologyCategory.find({ deletedAt: null }).sort({ order: 1 }).lean()
    return successResponse(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return errorResponse('Failed to fetch categories', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    const category = await TechnologyCategory.create(data)
    revalidatePortfolio()
    return successResponse(category, 'Category created successfully', 201)
  } catch (error) {
    console.error('Error creating category:', error)
    return errorResponse('Failed to create category', 500)
  }
}
