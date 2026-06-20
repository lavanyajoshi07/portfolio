import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { TechnologyCategory } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'
import { Types } from 'mongoose'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid category ID', 400)
    }

    const category = await TechnologyCategory.findOne({ _id: id, deletedAt: null }).lean()

    if (!category) {
      return errorResponse('Category not found', 404)
    }

    return successResponse(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return errorResponse('Failed to fetch category', 500)
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
      return errorResponse('Invalid category ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const category = await TechnologyCategory.findOneAndUpdate(
      { _id: id, deletedAt: null },
      data,
      { new: true }
    )

    if (!category) {
      return errorResponse('Category not found', 404)
    }

    revalidatePortfolio()
    return successResponse(category, 'Category updated successfully')
  } catch (error) {
    console.error('Error updating category:', error)
    return errorResponse('Failed to update category', 500)
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
      return errorResponse('Invalid category ID', 400)
    }

    await connectDB()
    
    // Soft delete category by setting deletedAt to now
    const category = await TechnologyCategory.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    )

    if (!category) {
      return errorResponse('Category not found or already deleted', 404)
    }

    revalidatePortfolio()
    return successResponse({ id }, 'Category deleted successfully')
  } catch (error) {
    console.error('Error deleting category:', error)
    return errorResponse('Failed to delete category', 500)
  }
}
