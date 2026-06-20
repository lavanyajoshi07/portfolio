import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { FutureGoal } from '@/models'
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
      return errorResponse('Invalid goal ID', 400)
    }

    const goal = await FutureGoal.findById(id).lean()

    if (!goal) {
      return errorResponse('Goal not found', 404)
    }

    return successResponse(goal)
  } catch (error) {
    console.error('Error fetching future goal:', error)
    return errorResponse('Failed to fetch goal', 500)
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
      return errorResponse('Invalid goal ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const goal = await FutureGoal.findByIdAndUpdate(id, data, { new: true })

    if (!goal) {
      return errorResponse('Goal not found', 404)
    }

    revalidatePortfolio()
    return successResponse(goal, 'Goal updated successfully')
  } catch (error) {
    console.error('Error updating future goal:', error)
    return errorResponse('Failed to update goal', 500)
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
      return errorResponse('Invalid goal ID', 400)
    }

    await connectDB()
    const goal = await FutureGoal.findByIdAndDelete(id)

    if (!goal) {
      return errorResponse('Goal not found', 404)
    }

    revalidatePortfolio()
    return successResponse({ id }, 'Goal deleted successfully')
  } catch (error) {
    console.error('Error deleting future goal:', error)
    return errorResponse('Failed to delete goal', 500)
  }
}
