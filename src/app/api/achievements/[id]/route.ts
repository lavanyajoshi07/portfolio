import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Achievement } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'
import { Types } from 'mongoose'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return errorResponse('Invalid achievement ID', 400)
    }

    const achievement = await Achievement.findById(params.id).lean()

    if (!achievement) {
      return errorResponse('Achievement not found', 404)
    }

    return successResponse(achievement)
  } catch (error) {
    console.error('Error fetching achievement:', error)
    return errorResponse('Failed to fetch achievement', 500)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(params.id)) {
      return errorResponse('Invalid achievement ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const achievement = await Achievement.findByIdAndUpdate(params.id, data, { new: true })

    if (!achievement) {
      return errorResponse('Achievement not found', 404)
    }

    return successResponse(achievement, 'Achievement updated successfully')
  } catch (error) {
    console.error('Error updating achievement:', error)
    return errorResponse('Failed to update achievement', 500)
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(params.id)) {
      return errorResponse('Invalid achievement ID', 400)
    }

    await connectDB()
    const achievement = await Achievement.findByIdAndDelete(params.id)

    if (!achievement) {
      return errorResponse('Achievement not found', 404)
    }

    return successResponse({ id: params.id }, 'Achievement deleted successfully')
  } catch (error) {
    console.error('Error deleting achievement:', error)
    return errorResponse('Failed to delete achievement', 500)
  }
}