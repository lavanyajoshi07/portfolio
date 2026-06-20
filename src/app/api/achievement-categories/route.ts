import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { AchievementCategory } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const url = new URL(req.url)
    const showTrash = url.searchParams.get('trash') === 'true'

    const filter = showTrash
      ? { deletedAt: { $ne: null } }
      : { deletedAt: null }

    const categories = await AchievementCategory.find(filter)
      .sort({ displayOrder: 1 })
      .lean()

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

    const category = await AchievementCategory.create(data)
    return successResponse(category, 'Category created successfully', 201)
  } catch (error) {
    console.error('Error creating category:', error)
    return errorResponse('Failed to create category', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    if (data.reorder && Array.isArray(data.items)) {
      const updates = data.items.map((item: any) =>
        AchievementCategory.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
      )
      await Promise.all(updates)
      revalidatePortfolio()
      return successResponse({ success: true }, 'Categories reordered successfully')
    }

    return errorResponse('Invalid request body', 400)
  } catch (error) {
    console.error('Error batch updating categories:', error)
    return errorResponse('Failed to batch update categories', 500)
  }
}

