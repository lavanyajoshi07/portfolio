import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Achievement } from '@/models'
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
      return errorResponse('Invalid achievement ID', 400)
    }

    const achievement = await Achievement.findById(id).lean()

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid achievement ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const achievement = await Achievement.findByIdAndUpdate(id, data, { new: true })

    if (!achievement) {
      return errorResponse('Achievement not found', 404)
    }

    revalidatePortfolio()
    return successResponse(achievement, 'Achievement updated successfully')
  } catch (error) {
    console.error('Error updating achievement:', error)
    return errorResponse('Failed to update achievement', 500)
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
      return errorResponse('Invalid achievement ID', 400)
    }

    await connectDB()
    const achievement = await Achievement.findByIdAndDelete(id)

    if (!achievement) {
      return errorResponse('Achievement not found', 404)
    }

    revalidatePortfolio()
    return successResponse({ id }, 'Achievement deleted successfully')
  } catch (error) {
    console.error('Error deleting achievement:', error)
    return errorResponse('Failed to delete achievement', 500)
  }
}
