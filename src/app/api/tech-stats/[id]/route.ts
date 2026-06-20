import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { TechStats } from '@/models'
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
      return errorResponse('Invalid tech stat ID', 400)
    }

    const stat = await TechStats.findOne({ _id: id, deletedAt: null }).lean()

    if (!stat) {
      return errorResponse('Tech stat not found', 404)
    }

    return successResponse(stat)
  } catch (error) {
    console.error('Error fetching tech stat:', error)
    return errorResponse('Failed to fetch tech stat', 500)
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
      return errorResponse('Invalid tech stat ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const stat = await TechStats.findOneAndUpdate(
      { _id: id, deletedAt: null },
      data,
      { new: true }
    )

    if (!stat) {
      return errorResponse('Tech stat not found', 404)
    }

    revalidatePortfolio()
    return successResponse(stat, 'Tech stat updated successfully')
  } catch (error) {
    console.error('Error updating tech stat:', error)
    return errorResponse('Failed to update tech stat', 500)
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
      return errorResponse('Invalid tech stat ID', 400)
    }

    await connectDB()
    
    // Soft delete tech stat by setting deletedAt to now
    const stat = await TechStats.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    )

    if (!stat) {
      return errorResponse('Tech stat not found or already deleted', 404)
    }

    revalidatePortfolio()
    return successResponse({ id }, 'Tech stat deleted successfully')
  } catch (error) {
    console.error('Error deleting tech stat:', error)
    return errorResponse('Failed to delete tech stat', 500)
  }
}
