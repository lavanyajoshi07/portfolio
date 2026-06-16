import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Timeline } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    const timeline = await Timeline.find().sort({ order: 1 }).lean()
    return successResponse(timeline)
  } catch (error) {
    console.error('Error fetching timeline:', error)
    return errorResponse('Failed to fetch timeline', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    const item = await Timeline.create(data)
    revalidatePortfolio()
    return successResponse(item, 'Timeline item created successfully', 201)
  } catch (error) {
    console.error('Error creating timeline item:', error)
    return errorResponse('Failed to create timeline item', 500)
  }
}
