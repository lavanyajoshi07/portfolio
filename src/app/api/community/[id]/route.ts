import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { CommunityItem } from '@/models'
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
      return errorResponse('Invalid community ID', 400)
    }

    const item = await CommunityItem.findById(id).lean()

    if (!item) {
      return errorResponse('Community item not found', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching community item:', error)
    return errorResponse('Failed to fetch community item', 500)
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
      return errorResponse('Invalid community ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const item = await CommunityItem.findByIdAndUpdate(id, data, { new: true })

    if (!item) {
      return errorResponse('Community item not found', 404)
    }

    revalidatePortfolio()
    return successResponse(item, 'Community item updated successfully')
  } catch (error) {
    console.error('Error updating community item:', error)
    return errorResponse('Failed to update community item', 500)
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
      return errorResponse('Invalid community ID', 400)
    }

    await connectDB()
    const item = await CommunityItem.findByIdAndDelete(id)

    if (!item) {
      return errorResponse('Community item not found', 404)
    }

    revalidatePortfolio()
    return successResponse({ id }, 'Community item deleted successfully')
  } catch (error) {
    console.error('Error deleting community item:', error)
    return errorResponse('Failed to delete community item', 500)
  }
}
