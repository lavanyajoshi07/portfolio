import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Technology } from '@/models'
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
      return errorResponse('Invalid technology ID', 400)
    }

    const technology = await Technology.findOne({ _id: id, deletedAt: null }).lean()

    if (!technology) {
      return errorResponse('Technology not found', 404)
    }

    return successResponse(technology)
  } catch (error) {
    console.error('Error fetching technology:', error)
    return errorResponse('Failed to fetch technology', 500)
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
      return errorResponse('Invalid technology ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const technology = await Technology.findOneAndUpdate(
      { _id: id, deletedAt: null },
      data,
      { new: true }
    )

    if (!technology) {
      return errorResponse('Technology not found', 404)
    }

    revalidatePortfolio()
    return successResponse(technology, 'Technology updated successfully')
  } catch (error) {
    console.error('Error updating technology:', error)
    return errorResponse('Failed to update technology', 500)
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
      return errorResponse('Invalid technology ID', 400)
    }

    await connectDB()
    
    // Soft delete technology by setting deletedAt to now
    const technology = await Technology.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    )

    if (!technology) {
      return errorResponse('Technology not found or already deleted', 404)
    }

    revalidatePortfolio()
    return successResponse({ id }, 'Technology deleted successfully')
  } catch (error) {
    console.error('Error deleting technology:', error)
    return errorResponse('Failed to delete technology', 500)
  }
}
