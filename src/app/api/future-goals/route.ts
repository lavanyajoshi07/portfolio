import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { FutureGoal } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    const goals = await FutureGoal.find().sort({ order: 1 }).lean()
    return successResponse(goals)
  } catch (error) {
    console.error('Error fetching future goals:', error)
    return errorResponse('Failed to fetch goals', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    const goal = await FutureGoal.create(data)
    revalidatePortfolio()
    return successResponse(goal, 'Goal created successfully', 201)
  } catch (error) {
    console.error('Error creating future goal:', error)
    return errorResponse('Failed to create goal', 500)
  }
}
