import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Timeline } from '@/models'
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
      return errorResponse('Invalid timeline item ID', 400)
    }

    const item = await Timeline.findById(id).lean()

    if (!item) {
      return errorResponse('Timeline item not found', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching timeline item:', error)
    return errorResponse('Failed to fetch timeline item', 500)
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
      return errorResponse('Invalid timeline item ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const item = await Timeline.findByIdAndUpdate(id, data, { new: true })

    if (!item) {
      return errorResponse('Timeline item not found', 404)
    }

    revalidatePortfolio()
    return successResponse(item, 'Timeline item updated successfully')
  } catch (error) {
    console.error('Error updating timeline item:', error)
    return errorResponse('Failed to update timeline item', 500)
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
      return errorResponse('Invalid timeline item ID', 400)
    }

    await connectDB()
    const item = await Timeline.findByIdAndDelete(id)

    if (!item) {
      return errorResponse('Timeline item not found', 404)
    }

    revalidatePortfolio()
    return successResponse({ id }, 'Timeline item deleted successfully')
  } catch (error) {
    console.error('Error deleting timeline item:', error)
    return errorResponse('Failed to delete timeline item', 500)
  }
}
