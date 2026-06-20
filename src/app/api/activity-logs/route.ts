import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { ActivityLog } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    const logs = await ActivityLog.find().sort({ order: 1 }).lean()
    return successResponse(logs)
  } catch (error) {
    console.error('Error fetching activity logs:', error)
    return errorResponse('Failed to fetch activity logs', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    const log = await ActivityLog.create(data)
    revalidatePortfolio()
    return successResponse(log, 'Activity log created successfully', 201)
  } catch (error) {
    console.error('Error creating activity log:', error)
    return errorResponse('Failed to create activity log', 500)
  }
}
