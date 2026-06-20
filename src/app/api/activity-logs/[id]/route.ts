import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { ActivityLog } from '@/models'
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
      return errorResponse('Invalid log ID', 400)
    }

    const log = await ActivityLog.findById(id).lean()

    if (!log) {
      return errorResponse('Activity log not found', 404)
    }

    return successResponse(log)
  } catch (error) {
    console.error('Error fetching activity log:', error)
    return errorResponse('Failed to fetch activity log', 500)
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
      return errorResponse('Invalid log ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const log = await ActivityLog.findByIdAndUpdate(id, data, { new: true })

    if (!log) {
      return errorResponse('Activity log not found', 404)
    }

    revalidatePortfolio()
    return successResponse(log, 'Activity log updated successfully')
  } catch (error) {
    console.error('Error updating activity log:', error)
    return errorResponse('Failed to update activity log', 500)
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
      return errorResponse('Invalid log ID', 400)
    }

    await connectDB()
    const log = await ActivityLog.findByIdAndDelete(id)

    if (!log) {
      return errorResponse('Activity log not found', 404)
    }

    revalidatePortfolio()
    return successResponse({ id }, 'Activity log deleted successfully')
  } catch (error) {
    console.error('Error deleting activity log:', error)
    return errorResponse('Failed to delete activity log', 500)
  }
}
