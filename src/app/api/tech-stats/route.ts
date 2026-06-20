import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { TechStats } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    const stats = await TechStats.find({ deletedAt: null }).sort({ order: 1 }).lean()
    return successResponse(stats)
  } catch (error) {
    console.error('Error fetching tech stats:', error)
    return errorResponse('Failed to fetch tech stats', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    const stat = await TechStats.create(data)
    revalidatePortfolio()
    return successResponse(stat, 'Tech stat created successfully', 201)
  } catch (error) {
    console.error('Error creating tech stat:', error)
    return errorResponse('Failed to create tech stat', 500)
  }
}
